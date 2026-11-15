import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import type { AuthUser } from './src/types/auth.ts';
import type { Issue } from './src/types/issue.ts';
import {
  canDeleteIssue,
  canModerateIssues,
  canViewIssuePublicly,
} from './src/utils/moderation.ts';
import {
  createSessionToken,
  deleteIssueById,
  findIssueById,
  getAllIssuesMerged,
  getConfiguredAdminEmail,
  incrementIssueHelpful,
  loginPasswordUser,
  moderateContributionWithAI,
  parseSessionUser,
  registerPasswordUser,
  resolveRoleForEmail,
  saveCommunityIssue,
  signTokenPayload,
  updateIssueModeration,
  verifySignedToken,
} from './server/store.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const SESSION_COOKIE_NAME = 'techcare_session';

interface CatalogItemInput {
  id: string;
  title: string;
  platform: string;
  category: string;
  summary: string;
  tags?: string[];
}

interface DiagnoseRequestBody {
  imageBase64?: string;
  mimeType?: string;
  note?: string;
  issuesCatalog?: CatalogItemInput[];
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function extractBase64Payload(raw: string, fallbackMime: string): { data: string; mimeType: string } {
  const dataUrlMatch = raw.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s);
  if (dataUrlMatch) {
    return {
      mimeType: dataUrlMatch[1],
      data: dataUrlMatch[2].replace(/\s+/g, ''),
    };
  }
  return {
    mimeType: fallbackMime || 'image/jpeg',
    data: raw.replace(/\s+/g, ''),
  };
}

function getBaseAppUrl(req: Request): string {
  const envUrl = process.env.APP_URL?.trim();
  if (envUrl && envUrl !== 'MY_APP_URL') {
    return envUrl.replace(/\/+$/, '');
  }
  const forwardedProto = (req.headers['x-forwarded-proto'] as string | undefined)?.split(',')[0]?.trim();
  const proto = forwardedProto || req.protocol || 'http';
  const host = req.get('host') || `localhost:${PORT}`;
  return `${proto}://${host}`;
}

function getGoogleOAuthCredentials(): { clientId: string; clientSecret: string } | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

function getFirebaseClientApiKey(): string | null {
  try {
    const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
    if (!fs.existsSync(configPath)) return null;
    const raw = fs.readFileSync(configPath, 'utf8');
    const parsed = JSON.parse(raw) as { apiKey?: string };
    return typeof parsed.apiKey === 'string' && parsed.apiKey.trim()
      ? parsed.apiKey.trim()
      : null;
  } catch {
    return null;
  }
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) {
      try {
        out[key] = decodeURIComponent(val);
      } catch {
        out[key] = val;
      }
    }
  }
  return out;
}

function extractSessionToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearer = authHeader.slice(7).trim();
    if (bearer) return bearer;
  }
  const cookies = parseCookies(req.headers.cookie);
  return cookies[SESSION_COOKIE_NAME] || null;
}

function getRequestUser(req: Request): AuthUser | null {
  return parseSessionUser(extractSessionToken(req));
}

function setSessionCookie(req: Request, res: Response, token: string) {
  const baseUrl = getBaseAppUrl(req);
  const isHttps = baseUrl.startsWith('https://') || req.secure;
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearSessionCookie(req: Request, res: Response) {
  const baseUrl = getBaseAppUrl(req);
  const isHttps = baseUrl.startsWith('https://') || req.secure;
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? 'none' : 'lax',
    path: '/',
  });
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.set('trust proxy', 1);

  app.use(express.json({ limit: '15mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  // --- Authentication Endpoints ---
  app.get('/api/auth/config', (req: Request, res: Response) => {
    const creds = getGoogleOAuthCredentials();
    const firebaseReady = Boolean(getFirebaseClientApiKey());
    res.json({
      googleConfigured: Boolean(creds) || firebaseReady,
      adminEmail: getConfiguredAdminEmail(),
      adminPasswordConfigured: Boolean(process.env.ADMIN_PASSWORD?.trim()),
      callbackUrl: `${getBaseAppUrl(req)}/auth/callback`,
    });
  });

  app.post('/api/auth/google/firebase', async (req: Request, res: Response) => {
    const firebaseApiKey = getFirebaseClientApiKey();
    if (!firebaseApiKey) {
      res.status(503).json({
        error: 'Chưa cấu hình đăng nhập Google trên máy chủ.',
      });
      return;
    }

    const { idToken } = (req.body ?? {}) as { idToken?: string };
    if (!idToken || typeof idToken !== 'string' || idToken.length < 20) {
      res.status(400).json({ error: 'Thiếu mã xác thực Google (ID Token).' });
      return;
    }

    try {
      const lookupRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseApiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        }
      );

      if (!lookupRes.ok) {
        res.status(401).json({
          error: 'Phiên đăng nhập Google không hợp lệ hoặc đã hết hạn.',
        });
        return;
      }

      const lookupData = (await lookupRes.json()) as {
        users?: Array<{
          localId?: string;
          email?: string;
          emailVerified?: boolean;
          displayName?: string;
          photoUrl?: string;
          providerUserInfo?: Array<{ providerId?: string }>;
        }>;
      };

      const record = lookupData.users?.[0];
      const hasGoogleProvider = Boolean(
        record?.providerUserInfo?.some((p) => p.providerId === 'google.com')
      );
      if (!record?.email || (!record.emailVerified && !hasGoogleProvider)) {
        res.status(401).json({
          error: 'Tài khoản Google chưa được xác minh email hợp lệ.',
        });
        return;
      }

      const email = record.email.trim().toLowerCase();
      const user: AuthUser = {
        id: `google-${record.localId || email}`,
        email,
        name: record.displayName?.trim() || email.split('@')[0],
        avatarUrl: record.photoUrl,
        provider: 'google',
        role: resolveRoleForEmail(email, true),
      };

      const sessionToken = createSessionToken(user);
      setSessionCookie(req, res, sessionToken);
      res.json({ token: sessionToken, user });
    } catch {
      res.status(502).json({
        error: 'Không thể kết nối máy chủ xác thực Google. Vui lòng thử lại.',
      });
    }
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = getRequestUser(req);
    res.json({ user });
  });

  app.get('/api/auth/google/url', (req: Request, res: Response) => {
    const creds = getGoogleOAuthCredentials();
    const callbackUrl = `${getBaseAppUrl(req)}/auth/callback`;
    if (!creds) {
      res.status(503).json({
        error: 'Chưa cấu hình GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET trong Settings > Secrets.',
        callbackUrl,
      });
      return;
    }

    const state = signTokenPayload({ nonce: crypto.randomBytes(16).toString('hex') }, 600);
    const params = new URLSearchParams({
      client_id: creds.clientId,
      redirect_uri: callbackUrl,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'online',
      prompt: 'select_account',
      state,
    });
    res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
  });

  const handleGoogleCallback = async (req: Request, res: Response) => {
    const creds = getGoogleOAuthCredentials();
    const { code, state, error: oauthError } = req.query as Record<string, string | undefined>;

    const renderResultPage = (payload: { type: string; token?: string; user?: AuthUser; error?: string }) => {
      const serialized = JSON.stringify(payload).replace(/</g, '\\u003c');
      const statusText = payload.error
        ? `Đăng nhập thất bại: ${payload.error}`
        : 'Đăng nhập Google thành công. Cửa sổ sẽ tự động đóng...';
      res.status(payload.error ? 400 : 200).send(`<!doctype html>
<html lang="vi">
<head><meta charset="utf-8"><title>TechCare Google Sign-In</title></head>
<body style="background:#000;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;text-align:center;">
  <div>
    <p style="font-size:15px;">${statusText.replace(/</g, '&lt;')}</p>
  </div>
  <script>
    (function() {
      var data = ${serialized};
      if (window.opener) {
        window.opener.postMessage(data, '*');
        window.close();
      } else if (!data.error) {
        window.location.href = '/';
      }
    })();
  </script>
</body>
</html>`);
    };

    if (oauthError) {
      renderResultPage({ type: 'OAUTH_AUTH_ERROR', error: oauthError });
      return;
    }
    if (!creds) {
      renderResultPage({ type: 'OAUTH_AUTH_ERROR', error: 'Google OAuth chưa được cấu hình.' });
      return;
    }
    if (!code || !state || !verifySignedToken(state)) {
      renderResultPage({ type: 'OAUTH_AUTH_ERROR', error: 'Phiên xác thực OAuth không hợp lệ hoặc đã hết hạn.' });
      return;
    }

    try {
      const callbackUrl = `${getBaseAppUrl(req)}/auth/callback`;
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: creds.clientId,
          client_secret: creds.clientSecret,
          redirect_uri: callbackUrl,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenRes.ok) {
        renderResultPage({ type: 'OAUTH_AUTH_ERROR', error: 'Không thể đổi mã xác thực với Google.' });
        return;
      }

      const tokenData = (await tokenRes.json()) as { access_token?: string };
      if (!tokenData.access_token) {
        renderResultPage({ type: 'OAUTH_AUTH_ERROR', error: 'Không nhận được Access Token từ Google.' });
        return;
      }

      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });
      if (!userInfoRes.ok) {
        renderResultPage({ type: 'OAUTH_AUTH_ERROR', error: 'Không thể lấy thông tin tài khoản Google.' });
        return;
      }

      const profile = (await userInfoRes.json()) as {
        sub?: string;
        email?: string;
        email_verified?: boolean;
        name?: string;
        picture?: string;
      };

      if (!profile.email || !profile.email_verified) {
        renderResultPage({
          type: 'OAUTH_AUTH_ERROR',
          error: 'Tài khoản Google chưa xác minh địa chỉ email.',
        });
        return;
      }

      const email = profile.email.trim().toLowerCase();
      const user: AuthUser = {
        id: `google-${profile.sub || email}`,
        email,
        name: profile.name?.trim() || email.split('@')[0],
        avatarUrl: profile.picture,
        provider: 'google',
        role: resolveRoleForEmail(email, true),
      };

      const sessionToken = createSessionToken(user);
      setSessionCookie(req, res, sessionToken);
      renderResultPage({ type: 'OAUTH_AUTH_SUCCESS', token: sessionToken, user });
    } catch {
      renderResultPage({ type: 'OAUTH_AUTH_ERROR', error: 'Lỗi kết nối máy chủ Google OAuth.' });
    }
  };

  app.get(['/auth/callback', '/auth/callback/'], handleGoogleCallback);

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { email, password, name } = (req.body ?? {}) as {
      email?: string;
      password?: string;
      name?: string;
    };
    const result = registerPasswordUser(email || '', password || '', name || '');
    if (result.error || !result.user) {
      res.status(400).json({ error: result.error || 'Không thể đăng ký tài khoản.' });
      return;
    }
    const token = createSessionToken(result.user);
    setSessionCookie(req, res, token);
    res.status(201).json({ token, user: result.user });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = (req.body ?? {}) as { email?: string; password?: string };
    const result = loginPasswordUser(email || '', password || '');
    if (result.error || !result.user) {
      res.status(401).json({ error: result.error || 'Đăng nhập thất bại.' });
      return;
    }
    const token = createSessionToken(result.user);
    setSessionCookie(req, res, token);
    res.json({ token, user: result.user });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    clearSessionCookie(req, res);
    res.json({ ok: true });
  });

  // --- Issues, AI Moderation & Admin Endpoints ---
  app.get('/api/issues', (req: Request, res: Response) => {
    const user = getRequestUser(req);
    const includeAll = req.query.scope === 'all' && canModerateIssues(user);
    const all = getAllIssuesMerged();
    const visible = includeAll ? all : all.filter((issue) => canViewIssuePublicly(issue, user));
    res.json({ issues: visible });
  });

  app.post('/api/issues', async (req: Request, res: Response) => {
    const user = getRequestUser(req);
    if (!user) {
      res.status(401).json({
        error: 'Vui lòng đăng nhập tài khoản trước khi đóng góp giải pháp.',
      });
      return;
    }

    const payload = (req.body ?? {}) as Partial<Issue>;
    const title = typeof payload.title === 'string' ? payload.title.trim() : '';
    const summary = typeof payload.summary === 'string' ? payload.summary.trim() : '';
    const causes = Array.isArray(payload.causes)
      ? payload.causes.map((c) => String(c).trim()).filter(Boolean)
      : [];
    const steps = Array.isArray(payload.steps)
      ? payload.steps
          .filter((s) => s && typeof s.instructions === 'string' && s.instructions.trim())
          .map((s, idx) => ({
            stepNumber: idx + 1,
            title: typeof s.title === 'string' && s.title.trim() ? s.title.trim() : `Bước ${idx + 1}`,
            instructions: s.instructions.trim(),
            tip: typeof s.tip === 'string' && s.tip.trim() ? s.tip.trim() : undefined,
            warning: typeof s.warning === 'string' && s.warning.trim() ? s.warning.trim() : undefined,
          }))
      : [];

    if (title.length < 5 || summary.length < 10 || causes.length === 0 || steps.length === 0) {
      res.status(400).json({
        error: 'Vui lòng nhập đầy đủ tiêu đề, tóm tắt, nguyên nhân và ít nhất 1 bước khắc phục.',
      });
      return;
    }

    const symptoms = Array.isArray(payload.symptoms)
      ? payload.symptoms.map((s) => String(s).trim()).filter(Boolean)
      : [];
    const requiredTools = Array.isArray(payload.requiredTools)
      ? payload.requiredTools.map((t) => String(t).trim()).filter(Boolean)
      : undefined;

    const validPlatforms = new Set(['iphone', 'android', 'windows', 'mac', 'hardware']);
    const validCategories = new Set(['system', 'screen', 'battery', 'network', 'hardware', 'security']);
    const validSeverities = new Set(['easy', 'medium', 'hard']);

    const platform = validPlatforms.has(String(payload.platform))
      ? (payload.platform as Issue['platform'])
      : 'hardware';
    const category = validCategories.has(String(payload.category))
      ? (payload.category as Issue['category'])
      : 'system';
    const severity = validSeverities.has(String(payload.severity))
      ? (payload.severity as Issue['severity'])
      : 'medium';

    const authorName =
      typeof payload.author === 'string' && payload.author.trim()
        ? payload.author.trim().slice(0, 60)
        : user.name;

    const moderation = await moderateContributionWithAI(getGeminiClient(), {
      title,
      summary,
      symptoms,
      causes,
      steps,
      requiredTools,
      author: authorName,
    });

    const newIssue: Issue = {
      id: `custom-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      title: title.slice(0, 180),
      platform,
      category,
      severity,
      estimatedTime:
        typeof payload.estimatedTime === 'string' && payload.estimatedTime.trim()
          ? payload.estimatedTime.trim().slice(0, 40)
          : '10 phút',
      summary: summary.slice(0, 600),
      symptoms,
      causes,
      steps,
      requiredTools,
      tags: Array.isArray(payload.tags) && payload.tags.length > 0
        ? payload.tags.slice(0, 6).map((t) => String(t).trim()).filter(Boolean)
        : [platform, category],
      author: authorName,
      authorEmail: user.email,
      authorId: user.id,
      createdAt: new Date().toISOString().split('T')[0],
      helpfulCount: 1,
      isUserSubmitted: true,
      moderationStatus: moderation.status,
      moderationReason: moderation.reason,
      moderatedBy: 'ai',
      moderatedAt: new Date().toISOString(),
    };

    saveCommunityIssue(newIssue);
    res.status(201).json({ issue: newIssue });
  });

  app.patch('/api/issues/:id/moderate', (req: Request, res: Response) => {
    const user = getRequestUser(req);
    if (!canModerateIssues(user)) {
      res.status(403).json({
        error: 'Chỉ tài khoản Quản trị viên (Admin) mới có quyền duyệt hoặc từ chối bài viết.',
      });
      return;
    }

    const id = req.params.id;
    const { status, reason } = (req.body ?? {}) as { status?: string; reason?: string };
    if (status !== 'approved' && status !== 'rejected') {
      res.status(400).json({ error: 'Trạng thái duyệt không hợp lệ.' });
      return;
    }

    const defaultReason =
      status === 'approved'
        ? `Đã được Admin (${user?.email}) phê duyệt hiển thị.`
        : `Đã bị Admin (${user?.email}) từ chối hiển thị.`;
    const updated = updateIssueModeration(
      id,
      status,
      typeof reason === 'string' && reason.trim() ? reason.trim() : defaultReason,
      'admin'
    );
    if (!updated) {
      res.status(404).json({ error: 'Không tìm thấy bài viết cần duyệt.' });
      return;
    }
    res.json({ issue: updated });
  });

  app.delete('/api/issues/:id', (req: Request, res: Response) => {
    const user = getRequestUser(req);
    if (!user) {
      res.status(401).json({ error: 'Vui lòng đăng nhập để thực hiện thao tác này.' });
      return;
    }
    const existing = findIssueById(req.params.id);
    if (!existing) {
      res.status(404).json({ error: 'Không tìm thấy bài viết cần xóa.' });
      return;
    }
    if (!canDeleteIssue(existing, user)) {
      res.status(403).json({
        error: 'Bạn không có quyền xóa bài viết này. Chỉ Admin mới có thể xóa mọi bài đóng góp.',
      });
      return;
    }

    deleteIssueById(existing.id);
    res.json({ ok: true, id: existing.id });
  });

  app.post('/api/issues/:id/helpful', (req: Request, res: Response) => {
    const nextCount = incrementIssueHelpful(req.params.id);
    if (nextCount === null) {
      res.status(404).json({ error: 'Không tìm thấy bài viết.' });
      return;
    }
    res.json({ helpfulCount: nextCount });
  });

  app.post('/api/diagnose-image', async (req: Request, res: Response) => {
    const body = (req.body ?? {}) as DiagnoseRequestBody;

    if (!body.imageBase64 || typeof body.imageBase64 !== 'string') {
      res.status(400).json({
        error: 'Thiếu dữ liệu hình ảnh. Vui lòng chụp từ camera hoặc tải ảnh thiết bị bị lỗi.',
      });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error:
          'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Vui lòng kiểm tra khóa API trong Settings > Secrets.',
      });
      return;
    }

    const { data, mimeType } = extractBase64Payload(body.imageBase64, body.mimeType || 'image/jpeg');
    if (!data || data.length < 32) {
      res.status(400).json({
        error: 'Dữ liệu hình ảnh không hợp lệ hoặc bị trống.',
      });
      return;
    }

    const catalog = Array.isArray(body.issuesCatalog) ? body.issuesCatalog.slice(0, 60) : [];
    const catalogText = catalog
      .map(
        (item) =>
          `- "${item.id}" [${item.platform}/${item.category}]: ${item.title}`
      )
      .join('\n');

    const userNote = typeof body.note === 'string' && body.note.trim() ? body.note.trim() : 'Không có';

    const systemInstruction = `Bạn là bộ máy nhận diện lỗi thiết bị điện tử bằng thị giác (Gemini Vision) tích hợp trong TechCare.
VAI TRÒ CỐT LÕI:
1. Bạn CHỈ nhận diện lỗi qua hình ảnh (hệ điều hành, mã lỗi, thông báo màn hình, biểu tượng cảnh báo, hư hỏng phần cứng) và ĐỀ XUẤT MÔ-ĐUN LỖI từ danh mục TechCare để người dùng tự mở và xử lý trên web.
2. Luôn đối chiếu với danh mục TechCare trước và điền 1-3 ID khớp nhất vào "matchedIssueIds".
3. Nếu ảnh không phải thiết bị điện tử hoặc không có lỗi rõ ràng: đặt "isDeviceErrorDetected": false, "matchedIssueIds": [], giải thích ngắn gọn bằng tiếng Việt.
4. CHỈ tạo "suggestedModule" (tối đa 3 bước ngắn gọn) khi "isDeviceErrorDetected" là true VÀ danh mục hiện có KHÔNG có mô-đun nào khớp. Nếu đã có ID khớp trong "matchedIssueIds", bỏ qua "suggestedModule".
5. Viết tiếng Việt chuẩn xác, ngắn gọn, không sai chính tả.`;

    const promptText = `Phân tích lỗi trong ảnh thiết bị. Ghi chú thêm: ${userNote}

Danh mục mô-đun TechCare:
${catalogText || '(Trống)'}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isDeviceErrorDetected: {
                type: Type.BOOLEAN,
                description: 'True nếu hình ảnh thể hiện lỗi hoặc sự cố thiết bị điện tử.',
              },
              detectedPlatform: {
                type: Type.STRING,
                description: 'Một trong: iphone, android, windows, mac, hardware',
              },
              detectedIssueTitle: {
                type: Type.STRING,
                description: 'Tên ngắn gọn của lỗi được nhận diện từ hình ảnh.',
              },
              confidence: {
                type: Type.INTEGER,
                description: 'Độ tin cậy nhận diện từ 0 đến 100.',
              },
              errorCodeOrText: {
                type: Type.STRING,
                description: 'Mã lỗi hoặc dòng thông báo chính đọc được từ màn hình (nếu có).',
              },
              visualObservations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '2-3 dấu hiệu trực quan mà Gemini quan sát được trong ảnh.',
              },
              matchedIssueIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '1-3 ID mô-đun khớp nhất từ danh mục TechCare.',
              },
              reasonForRecommendation: {
                type: Type.STRING,
                description: '1 câu giải thích vì sao đề xuất các mô-đun này.',
              },
              suggestedModule: {
                type: Type.OBJECT,
                description: 'Chỉ điền khi matchedIssueIds rỗng và cần tạo mô-đun mới.',
                properties: {
                  title: { type: Type.STRING },
                  platform: { type: Type.STRING, description: 'iphone | android | windows | mac | hardware' },
                  category: { type: Type.STRING, description: 'system | screen | battery | network | hardware | security' },
                  severity: { type: Type.STRING, description: 'easy | medium | hard' },
                  estimatedTime: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
                  causes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        instructions: { type: Type.STRING },
                      },
                      required: ['title', 'instructions'],
                    },
                  },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['title', 'platform', 'category', 'severity', 'summary', 'steps'],
              },
            },
            required: [
              'isDeviceErrorDetected',
              'detectedPlatform',
              'detectedIssueTitle',
              'confidence',
              'visualObservations',
              'matchedIssueIds',
              'reasonForRecommendation',
            ],
          },
        },
      });

      const responseText = response.text?.trim();
      if (!responseText) {
        res.status(502).json({
          error: 'Gemini không trả về kết quả phân tích. Vui lòng thử chụp ảnh rõ nét hơn.',
        });
        return;
      }

      res.json({ rawText: responseText });
    } catch (err: unknown) {
      const errorObj = err as { status?: number; message?: string };
      const status = typeof errorObj?.status === 'number' ? errorObj.status : 500;
      const msg = errorObj?.message || 'Lỗi kết nối Gemini API.';

      if (status === 400 || status === 403 || msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED')) {
        res.status(status).json({
          error: 'Khóa API Gemini không hợp lệ hoặc thiếu quyền truy cập. Vui lòng kiểm tra lại trong Settings > Secrets.',
        });
        return;
      }

      if (status === 429 || msg.includes('RESOURCE_EXHAUSTED')) {
        res.status(429).json({
          error: 'Hệ thống đang đạt giới hạn lượt phân tích. Vui lòng thử lại sau vài giây.',
        });
        return;
      }

      res.status(500).json({
        error: `Không thể phân tích hình ảnh lúc này: ${msg}`,
      });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const hmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        hmr: hmrDisabled ? false : { server: httpServer },
        ws: { server: httpServer },
        watch: hmrDisabled ? null : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`TechCare server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
