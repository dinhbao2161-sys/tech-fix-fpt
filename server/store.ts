import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { DEFAULT_ISSUES } from '../src/data/defaultIssues.ts';
import type { AuthUser, UserRole } from '../src/types/auth.ts';
import type { Issue, ModerationStatus } from '../src/types/issue.ts';
import {
  DEFAULT_ADMIN_EMAIL,
  isAdminEmail,
  normalizeEmail,
  parseModerationResponse,
} from '../src/utils/moderation.ts';

export interface StoredPasswordUser {
  id: string;
  email: string;
  name: string;
  passwordSalt: string;
  passwordHash: string;
  createdAt: string;
}

interface AppDatabase {
  sessionSecret?: string;
  users: StoredPasswordUser[];
  communityIssues: Issue[];
  deletedIssueIds: string[];
  helpfulOverrides: Record<string, number>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'app-db.json');

function ensureDbDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readDb(): AppDatabase {
  ensureDbDir();
  if (!fs.existsSync(DB_FILE)) {
    const initial: AppDatabase = {
      sessionSecret: crypto.randomBytes(32).toString('hex'),
      users: [],
      communityIssues: [],
      deletedIssueIds: [],
      helpfulOverrides: {},
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<AppDatabase>;
    return {
      sessionSecret:
        typeof parsed.sessionSecret === 'string' && parsed.sessionSecret.length >= 16
          ? parsed.sessionSecret
          : crypto.randomBytes(32).toString('hex'),
      users: Array.isArray(parsed.users) ? parsed.users : [],
      communityIssues: Array.isArray(parsed.communityIssues) ? parsed.communityIssues : [],
      deletedIssueIds: Array.isArray(parsed.deletedIssueIds) ? parsed.deletedIssueIds : [],
      helpfulOverrides:
        parsed.helpfulOverrides && typeof parsed.helpfulOverrides === 'object'
          ? parsed.helpfulOverrides
          : {},
    };
  } catch {
    return {
      sessionSecret: crypto.randomBytes(32).toString('hex'),
      users: [],
      communityIssues: [],
      deletedIssueIds: [],
      helpfulOverrides: {},
    };
  }
}

function writeDb(db: AppDatabase) {
  ensureDbDir();
  const tempPath = `${DB_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tempPath, DB_FILE);
}

export function getConfiguredAdminEmail(): string {
  return normalizeEmail(process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL) || DEFAULT_ADMIN_EMAIL;
}

export function getSessionSecret(): string {
  const envSecret = process.env.SESSION_SECRET?.trim();
  if (envSecret && envSecret.length >= 16) return envSecret;
  const db = readDb();
  if (!db.sessionSecret) {
    db.sessionSecret = crypto.randomBytes(32).toString('hex');
    writeDb(db);
  }
  return db.sessionSecret;
}

export function resolveRoleForEmail(email: string, verifiedByTrustedProvider: boolean): UserRole {
  if (verifiedByTrustedProvider && isAdminEmail(email, getConfiguredAdminEmail())) {
    return 'admin';
  }
  return 'user';
}

export function signTokenPayload(payload: Record<string, unknown>, ttlSeconds = 60 * 60 * 24 * 7): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const data = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const sig = crypto.createHmac('sha256', getSessionSecret()).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verifySignedToken<T extends Record<string, unknown>>(token: string | undefined | null): T | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', getSessionSecret()).update(data).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as T & { exp?: number };
    if (typeof parsed.exp === 'number' && parsed.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function createSessionToken(user: AuthUser): string {
  return signTokenPayload({ user });
}

export function parseSessionUser(token: string | undefined | null): AuthUser | null {
  const verified = verifySignedToken<{ user?: AuthUser }>(token);
  if (!verified?.user || typeof verified.user.email !== 'string') return null;
  const u = verified.user;
  // Re-validate admin privilege against configured ADMIN_EMAIL on read
  const trustedAdmin =
    (u.provider === 'google' || Boolean(process.env.ADMIN_PASSWORD?.trim())) &&
    isAdminEmail(u.email, getConfiguredAdminEmail());
  return {
    ...u,
    role: u.role === 'admin' && trustedAdmin ? 'admin' : 'user',
  };
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function registerPasswordUser(emailInput: string, password: string, name: string): { user?: AuthUser; error?: string } {
  const email = normalizeEmail(emailInput);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Địa chỉ email không hợp lệ.' };
  }
  if (isAdminEmail(email, getConfiguredAdminEmail())) {
    return {
      error:
        'Email quản trị viên không thể đăng ký tự do bằng form thường. Vui lòng dùng "Đăng nhập bằng Google" hoặc mật khẩu Admin được cấu hình.',
    };
  }
  if (!password || password.length < 6) {
    return { error: 'Mật khẩu cần tối thiểu 6 ký tự.' };
  }
  const cleanName = name.trim();
  if (cleanName.length < 2) {
    return { error: 'Vui lòng nhập họ tên hoặc bí danh (tối thiểu 2 ký tự).' };
  }

  const db = readDb();
  if (db.users.some((u) => u.email === email)) {
    return { error: 'Email này đã được đăng ký. Vui lòng chuyển sang tab Đăng nhập.' };
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const newUser: StoredPasswordUser = {
    id: `pwd-${crypto.randomUUID()}`,
    email,
    name: cleanName.slice(0, 60),
    passwordSalt: salt,
    passwordHash: hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDb(db);

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      provider: 'password',
      role: 'user',
    },
  };
}

export function loginPasswordUser(emailInput: string, password: string): { user?: AuthUser; error?: string } {
  const email = normalizeEmail(emailInput);
  if (!email || !password) {
    return { error: 'Vui lòng nhập đầy đủ email và mật khẩu.' };
  }

  const adminEmail = getConfiguredAdminEmail();
  const configuredAdminPassword = process.env.ADMIN_PASSWORD?.trim();
  if (isAdminEmail(email, adminEmail)) {
    if (!configuredAdminPassword) {
      return {
        error:
          'Tài khoản Admin sử dụng xác thực qua nút "Đăng nhập bằng Google" (hoặc cấu hình biến môi trường ADMIN_PASSWORD).',
      };
    }
    const a = Buffer.from(password);
    const b = Buffer.from(configuredAdminPassword);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return { error: 'Mật khẩu quản trị viên không chính xác.' };
    }
    return {
      user: {
        id: `admin-${adminEmail}`,
        email: adminEmail,
        name: 'Quản trị viên TechCare',
        provider: 'password',
        role: 'admin',
      },
    };
  }

  const db = readDb();
  const existing = db.users.find((u) => u.email === email);
  if (!existing) {
    return { error: 'Email chưa được đăng ký hoặc mật khẩu không đúng.' };
  }

  const computed = Buffer.from(hashPassword(password, existing.passwordSalt), 'hex');
  const stored = Buffer.from(existing.passwordHash, 'hex');
  if (computed.length !== stored.length || !crypto.timingSafeEqual(computed, stored)) {
    return { error: 'Email chưa được đăng ký hoặc mật khẩu không đúng.' };
  }

  return {
    user: {
      id: existing.id,
      email: existing.email,
      name: existing.name,
      provider: 'password',
      role: 'user',
    },
  };
}

export function getAllIssuesMerged(): Issue[] {
  const db = readDb();
  const deletedSet = new Set(db.deletedIssueIds);

  const community = db.communityIssues
    .filter((item) => !deletedSet.has(item.id))
    .map((item) => ({
      ...item,
      helpfulCount: db.helpfulOverrides[item.id] ?? item.helpfulCount,
      moderationStatus: item.moderationStatus ?? 'approved',
    }));

  const communityIds = new Set(community.map((c) => c.id));
  const defaults = DEFAULT_ISSUES.filter((d) => !deletedSet.has(d.id) && !communityIds.has(d.id)).map(
    (d) => ({
      ...d,
      helpfulCount: db.helpfulOverrides[d.id] ?? d.helpfulCount,
      moderationStatus: 'approved' as ModerationStatus,
      moderatedBy: 'system' as const,
    })
  );

  return [...community, ...defaults];
}

export function saveCommunityIssue(issue: Issue): Issue {
  const db = readDb();
  db.communityIssues = [issue, ...db.communityIssues.filter((i) => i.id !== issue.id)];
  db.deletedIssueIds = db.deletedIssueIds.filter((id) => id !== issue.id);
  writeDb(db);
  return issue;
}

export function findIssueById(id: string): Issue | undefined {
  return getAllIssuesMerged().find((i) => i.id === id);
}

export function updateIssueModeration(
  id: string,
  status: ModerationStatus,
  reason: string,
  moderatedBy: 'ai' | 'admin'
): Issue | null {
  const db = readDb();
  const idx = db.communityIssues.findIndex((i) => i.id === id);
  if (idx === -1) {
    // Allow moderating even if only in default issues? Usually community issues, but support fallback cleanly
    const def = DEFAULT_ISSUES.find((d) => d.id === id);
    if (!def) return null;
    const updated: Issue = {
      ...def,
      moderationStatus: status,
      moderationReason: reason,
      moderatedBy,
      moderatedAt: new Date().toISOString(),
    };
    db.communityIssues.unshift(updated);
    writeDb(db);
    return updated;
  }

  const updated: Issue = {
    ...db.communityIssues[idx],
    moderationStatus: status,
    moderationReason: reason,
    moderatedBy,
    moderatedAt: new Date().toISOString(),
  };
  db.communityIssues[idx] = updated;
  writeDb(db);
  return updated;
}

export function deleteIssueById(id: string): boolean {
  const db = readDb();
  const existedInCommunity = db.communityIssues.some((i) => i.id === id);
  const existedInDefault = DEFAULT_ISSUES.some((d) => d.id === id);
  if (!existedInCommunity && !existedInDefault) return false;

  db.communityIssues = db.communityIssues.filter((i) => i.id !== id);
  if (existedInDefault && !db.deletedIssueIds.includes(id)) {
    db.deletedIssueIds.push(id);
  }
  delete db.helpfulOverrides[id];
  writeDb(db);
  return true;
}

export function incrementIssueHelpful(id: string): number | null {
  const existing = findIssueById(id);
  if (!existing) return null;
  const db = readDb();
  const nextCount = (db.helpfulOverrides[id] ?? existing.helpfulCount) + 1;
  db.helpfulOverrides[id] = nextCount;
  const commIdx = db.communityIssues.findIndex((c) => c.id === id);
  if (commIdx !== -1) {
    db.communityIssues[commIdx].helpfulCount = nextCount;
  }
  writeDb(db);
  return nextCount;
}

export async function moderateContributionWithAI(
  ai: GoogleGenAI | null,
  issue: Pick<Issue, 'title' | 'summary' | 'symptoms' | 'causes' | 'steps' | 'requiredTools' | 'author'>
): Promise<{ status: ModerationStatus; reason: string }> {
  if (!ai) {
    return {
      status: 'pending',
      reason: 'Chờ quản trị viên duyệt (chưa cấu hình GEMINI_API_KEY để AI tự động kiểm duyệt).',
    };
  }

  const contentForReview = [
    `Tiêu đề: ${issue.title}`,
    `Tác giả: ${issue.author}`,
    `Tóm tắt: ${issue.summary}`,
    `Dấu hiệu: ${(issue.symptoms || []).join('; ')}`,
    `Nguyên nhân: ${(issue.causes || []).join('; ')}`,
    `Các bước: ${(issue.steps || [])
      .map((s) => `${s.title}: ${s.instructions} ${s.tip || ''} ${s.warning || ''}`)
      .join(' | ')}`,
    `Dụng cụ: ${(issue.requiredTools || []).join(', ')}`,
  ].join('\n');

  const systemInstruction = `Bạn là hệ thống kiểm duyệt nội dung AI cho cộng đồng hỗ trợ sửa lỗi thiết bị điện tử TechCare.
QUY TẮC DUYỆT BÀI:
- Tiêu chí duyệt rất thoáng và thực tế: MIỄN KHÔNG PHẢI nội dung 18+ (khiêu dâm, tình dục, gợi dục) VÀ KHÔNG PHẢI nội dung nhạy cảm (bạo lực cực đoan, kích động thù ghét/phân biệt đối xử, tự hại, ma túy/vũ khí bất hợp pháp, lừa đảo/đánh cắp tài khoản/mã độc hại, tiết lộ thông tin cá nhân nhạy cảm) thì TẤT CẢ các bài viết/ý kiến đóng góp đều ĐƯỢC DUYỆT ("approved": true).
- Các nội dung kỹ thuật hợp lệ như mở khóa khi quên mật khẩu cá nhân (passcode/Reset máy), sửa màn hình, thay pin, kiểm tra linh kiện, cài lại Windows... đều là bài viết hợp lệ và PHẢI được duyệt ("approved": true).
- Chỉ đặt "approved": false khi thực sự có dấu hiệu 18+ ("isAdult18Plus": true) hoặc nội dung nhạy cảm/độc hại rõ ràng ("isSensitiveContent": true).
- Giải thích lý do ngắn gọn bằng tiếng Việt chuẩn.`;

  const modelsToTry = ['gemini-4-hydrogen', 'gemini-3.1-flash-lite'];
  let lastErrorMsg = 'Lỗi kết nối AI';

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: `Kiểm duyệt bài đóng góp sau theo tiêu chí không chứa 18+ và không chứa nội dung nhạy cảm:\n\n${contentForReview}`,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              approved: {
                type: Type.BOOLEAN,
                description: 'true nếu không chứa 18+ và không chứa nội dung nhạy cảm.',
              },
              isAdult18Plus: {
                type: Type.BOOLEAN,
                description: 'true nếu chứa nội dung 18+, tình dục, khiêu dâm.',
              },
              isSensitiveContent: {
                type: Type.BOOLEAN,
                description: 'true nếu chứa nội dung nhạy cảm, bạo lực, thù ghét, bất hợp pháp, lừa đảo/mã độc.',
              },
              reason: {
                type: Type.STRING,
                description: 'Lý do kết luận ngắn gọn bằng tiếng Việt.',
              },
              flags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Danh sách nhãn vi phạm nếu có, rỗng nếu hợp lệ.',
              },
            },
            required: ['approved', 'isAdult18Plus', 'isSensitiveContent', 'reason', 'flags'],
          },
        },
      });

      const text = response.text?.trim();
      if (!text) {
        lastErrorMsg = 'AI không trả về phản hồi kiểm duyệt.';
        continue;
      }

      const verdict = parseModerationResponse(text);
      return {
        status: verdict.status,
        reason: verdict.reason,
      };
    } catch (err: unknown) {
      lastErrorMsg = err instanceof Error ? err.message : 'Lỗi kết nối AI';
    }
  }

  return {
    status: 'pending',
    reason: `Tạm chuyển chờ Admin duyệt thủ công (${lastErrorMsg}).`,
  };
}
