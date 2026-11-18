import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import crypto from 'node:crypto';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import type { Issue } from './src/types/issue.ts';
import {
  getAllIssuesMerged,
  incrementIssueHelpful,
  saveCommunityIssue,
} from './server/store.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

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

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.set('trust proxy', 1);

  app.use(express.json({ limit: '15mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  // --- Open Community Issues Endpoints (No login or AI moderation required) ---
  app.get('/api/issues', (_req: Request, res: Response) => {
    res.json({ issues: getAllIssuesMerged() });
  });

  app.post('/api/issues', (req: Request, res: Response) => {
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
        : 'Kỹ thuật viên cộng đồng';

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
      createdAt: new Date().toISOString().split('T')[0],
      helpfulCount: 1,
      isUserSubmitted: true,
    };

    saveCommunityIssue(newIssue);
    res.status(201).json({ issue: newIssue });
  });

  app.post('/api/issues/:id/helpful', (req: Request, res: Response) => {
    const nextCount = incrementIssueHelpful(req.params.id);
    if (nextCount === null) {
      res.status(404).json({ error: 'Không tìm thấy bài viết.' });
      return;
    }
    res.json({ helpfulCount: nextCount });
  });

  // --- Gemini Camera Vision Diagnostic Scanner ---
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
