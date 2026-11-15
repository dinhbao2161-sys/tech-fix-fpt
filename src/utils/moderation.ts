import type { AuthUser } from '../types/auth.ts';
import type { Issue, ModerationStatus } from '../types/issue.ts';

export const DEFAULT_ADMIN_EMAIL = 'dinhbao2161@gmail.com';

export interface AIModerationVerdict {
  approved: boolean;
  status: ModerationStatus;
  isAdult18Plus: boolean;
  isSensitiveContent: boolean;
  reason: string;
  flags: string[];
}

export function normalizeEmail(email: string | undefined | null): string {
  return (email ?? '').trim().toLowerCase();
}

export function isAdminEmail(
  email: string | undefined | null,
  configuredAdminEmail: string = DEFAULT_ADMIN_EMAIL
): boolean {
  const normalized = normalizeEmail(email);
  const adminNormalized = normalizeEmail(configuredAdminEmail || DEFAULT_ADMIN_EMAIL);
  return Boolean(normalized && adminNormalized && normalized === adminNormalized);
}

export function canModerateIssues(user: AuthUser | null | undefined): boolean {
  return Boolean(user && user.role === 'admin');
}

export function canDeleteIssue(
  issue: Issue,
  user: AuthUser | null | undefined
): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (!issue.isUserSubmitted) return false;
  return Boolean(
    (issue.authorId && issue.authorId === user.id) ||
      (issue.authorEmail && normalizeEmail(issue.authorEmail) === normalizeEmail(user.email))
  );
}

export function canViewIssuePublicly(
  issue: Issue,
  user: AuthUser | null | undefined
): boolean {
  const status = issue.moderationStatus ?? 'approved';
  if (status === 'approved') return true;
  if (!user) return false;
  if (user.role === 'admin') return true;
  return Boolean(
    (issue.authorId && issue.authorId === user.id) ||
      (issue.authorEmail && normalizeEmail(issue.authorEmail) === normalizeEmail(user.email))
  );
}

export function parseModerationResponse(rawText: string): AIModerationVerdict {
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const parsed = JSON.parse(cleaned) as Record<string, unknown>;
  const isAdult18Plus = Boolean(parsed.isAdult18Plus);
  const isSensitiveContent = Boolean(parsed.isSensitiveContent);
  const explicitApproved =
    typeof parsed.approved === 'boolean'
      ? parsed.approved
      : !isAdult18Plus && !isSensitiveContent;

  const approved = explicitApproved && !isAdult18Plus && !isSensitiveContent;
  const status: ModerationStatus = approved ? 'approved' : 'rejected';
  const flags = Array.isArray(parsed.flags)
    ? parsed.flags.filter((f): f is string => typeof f === 'string' && f.trim().length > 0)
    : [];

  const defaultReason = approved
    ? 'Nội dung hợp lệ, không chứa yếu tố 18+ hoặc nhạy cảm. AI đã tự động duyệt.'
    : 'Nội dung bị AI từ chối do phát hiện dấu hiệu 18+ hoặc nội dung nhạy cảm. Chờ quản trị viên xem xét.';

  const reason =
    typeof parsed.reason === 'string' && parsed.reason.trim().length > 0
      ? parsed.reason.trim()
      : defaultReason;

  return {
    approved,
    status,
    isAdult18Plus,
    isSensitiveContent,
    reason,
    flags,
  };
}
