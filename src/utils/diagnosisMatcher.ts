import { Issue } from '../types/issue';
import {
  DetectedPlatform,
  GeminiDiagnosisResult,
  SuggestedModuleDraft,
} from '../types/diagnosis';
import { removeVietnameseTones } from './filterIssues';

const VALID_PLATFORMS: DetectedPlatform[] = ['iphone', 'android', 'windows', 'mac', 'hardware'];
const VALID_CATEGORIES = ['system', 'screen', 'battery', 'network', 'hardware', 'security'] as const;
const VALID_SEVERITIES = ['easy', 'medium', 'hard'] as const;

export function normalizePlatform(val: unknown): DetectedPlatform {
  if (typeof val === 'string' && (VALID_PLATFORMS as string[]).includes(val.toLowerCase())) {
    return val.toLowerCase() as DetectedPlatform;
  }
  return 'hardware';
}

export function normalizeCategory(
  val: unknown
): 'system' | 'screen' | 'battery' | 'network' | 'hardware' | 'security' {
  if (typeof val === 'string') {
    const lower = val.toLowerCase().trim();
    if ((VALID_CATEGORIES as readonly string[]).includes(lower)) {
      return lower as 'system' | 'screen' | 'battery' | 'network' | 'hardware' | 'security';
    }
    if (lower.includes('màn hình') || lower.includes('hiển thị') || lower.includes('cảm ứng')) return 'screen';
    if (lower.includes('pin') || lower.includes('nguồn') || lower.includes('sạc')) return 'battery';
    if (lower.includes('mạng') || lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('sim')) return 'network';
    if (lower.includes('bảo mật') || lower.includes('mật khẩu') || lower.includes('khóa')) return 'security';
    if (lower.includes('phần cứng') || lower.includes('linh kiện')) return 'hardware';
  }
  return 'system';
}

export function normalizeSeverity(val: unknown): 'easy' | 'medium' | 'hard' {
  if (typeof val === 'string') {
    const lower = val.toLowerCase().trim();
    if ((VALID_SEVERITIES as readonly string[]).includes(lower)) {
      return lower as 'easy' | 'medium' | 'hard';
    }
    if (lower.includes('dễ') || lower.includes('cơ bản')) return 'easy';
    if (lower.includes('cao') || lower.includes('khó') || lower.includes('chuyên sâu')) return 'hard';
  }
  return 'medium';
}

/**
 * Parse and sanitize JSON returned by Gemini Vision.
 */
export function parseDiagnosisPayload(rawText: string): GeminiDiagnosisResult {
  const stripped = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  const parsed = JSON.parse(stripped) as Record<string, unknown>;

  const confidenceRaw = Number(parsed.confidence);
  const confidence = Number.isFinite(confidenceRaw)
    ? Math.max(0, Math.min(100, Math.round(confidenceRaw)))
    : 75;

  const visualObservations = Array.isArray(parsed.visualObservations)
    ? parsed.visualObservations.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];

  const matchedIssueIds = Array.isArray(parsed.matchedIssueIds)
    ? parsed.matchedIssueIds.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];

  let suggestedModule: SuggestedModuleDraft | undefined;
  if (parsed.suggestedModule && typeof parsed.suggestedModule === 'object') {
    const draft = parsed.suggestedModule as Record<string, unknown>;
    const rawSteps = Array.isArray(draft.steps) ? draft.steps : [];
    const steps = rawSteps
      .filter((s): s is Record<string, unknown> => Boolean(s && typeof s === 'object'))
      .map((s) => ({
        title: typeof s.title === 'string' && s.title.trim() ? s.title.trim() : 'Kiểm tra và xử lý bước tiếp theo',
        instructions:
          typeof s.instructions === 'string' && s.instructions.trim()
            ? s.instructions.trim()
            : 'Thực hiện kiểm tra thiết bị theo hướng dẫn chuẩn của TechCare.',
        tip: typeof s.tip === 'string' && s.tip.trim() ? s.tip.trim() : undefined,
        warning: typeof s.warning === 'string' && s.warning.trim() ? s.warning.trim() : undefined,
      }));

    if (typeof draft.title === 'string' && draft.title.trim() && steps.length > 0) {
      suggestedModule = {
        title: draft.title.trim(),
        platform: normalizePlatform(draft.platform ?? parsed.detectedPlatform),
        category: normalizeCategory(draft.category),
        severity: normalizeSeverity(draft.severity),
        estimatedTime:
          typeof draft.estimatedTime === 'string' && draft.estimatedTime.trim()
            ? draft.estimatedTime.trim()
            : '10 - 15 phút',
        summary:
          typeof draft.summary === 'string' && draft.summary.trim()
            ? draft.summary.trim()
            : 'Mô-đun khắc phục sự cố được đề xuất từ kết quả nhận diện hình ảnh.',
        symptoms: Array.isArray(draft.symptoms)
          ? draft.symptoms.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
          : visualObservations,
        causes: Array.isArray(draft.causes)
          ? draft.causes.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
          : ['Xung đột phần mềm hoặc lỗi phần cứng phát hiện qua hình ảnh'],
        requiredTools: Array.isArray(draft.requiredTools)
          ? draft.requiredTools.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
          : undefined,
        steps,
        tags: Array.isArray(draft.tags)
          ? draft.tags.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
          : [],
      };
    }
  }

  return {
    isDeviceErrorDetected: parsed.isDeviceErrorDetected !== false,
    detectedPlatform: normalizePlatform(parsed.detectedPlatform),
    detectedIssueTitle:
      typeof parsed.detectedIssueTitle === 'string' && parsed.detectedIssueTitle.trim()
        ? parsed.detectedIssueTitle.trim()
        : 'Không xác định rõ sự cố thiết bị',
    confidence,
    visualObservations,
    errorCodeOrText:
      typeof parsed.errorCodeOrText === 'string' && parsed.errorCodeOrText.trim()
        ? parsed.errorCodeOrText.trim()
        : undefined,
    matchedIssueIds,
    reasonForRecommendation:
      typeof parsed.reasonForRecommendation === 'string' && parsed.reasonForRecommendation.trim()
        ? parsed.reasonForRecommendation.trim()
        : 'Gemini đã phân tích hình ảnh và đối chiếu với kho mô-đun sửa lỗi TechCare.',
    suggestedModule,
  };
}

/**
 * Resolve matched TechCare modules from Gemini's matchedIssueIds,
 * falling back to keyword/platform scoring if matchedIssueIds yields fewer than 1 result.
 */
export function resolveMatchedIssues(
  diagnosis: GeminiDiagnosisResult,
  allIssues: Issue[],
  maxResults = 3
): Issue[] {
  if (!diagnosis.isDeviceErrorDetected) {
    return [];
  }

  const issueById = new Map(allIssues.map((issue) => [issue.id, issue]));
  const directMatches: Issue[] = [];
  const seenIds = new Set<string>();

  for (const id of diagnosis.matchedIssueIds) {
    const found = issueById.get(id);
    if (found && !seenIds.has(found.id)) {
      directMatches.push(found);
      seenIds.add(found.id);
    }
    if (directMatches.length >= maxResults) {
      return directMatches;
    }
  }

  if (directMatches.length > 0) {
    return directMatches;
  }

  // Keyword & platform fallback if Gemini didn't pick exact IDs
  const searchTokens = removeVietnameseTones(
    [
      diagnosis.detectedIssueTitle,
      diagnosis.errorCodeOrText ?? '',
      ...diagnosis.visualObservations,
    ].join(' ')
  )
    .split(/\s+/)
    .filter((token) => token.length >= 3);

  const scored = allIssues
    .map((issue) => {
      let score = 0;
      if (issue.platform === diagnosis.detectedPlatform) {
        score += 3;
      }
      const haystack = removeVietnameseTones(
        [issue.title, issue.summary, ...issue.tags, ...issue.symptoms].join(' ')
      );
      for (const token of searchTokens) {
        if (haystack.includes(token)) {
          score += 2;
        }
      }
      return { issue, score };
    })
    .filter((entry) => entry.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((entry) => entry.issue);

  return scored;
}

/**
 * Convert a Gemini-proposed module draft into a full TechCare Issue ready to open and fix on the web.
 */
export function buildModuleFromSuggestion(draft: SuggestedModuleDraft): Issue {
  return {
    id: `gemini-module-${Date.now()}`,
    title: draft.title,
    platform: draft.platform,
    category: draft.category,
    severity: draft.severity,
    estimatedTime: draft.estimatedTime,
    summary: draft.summary,
    symptoms: draft.symptoms.length > 0 ? draft.symptoms : ['Phát hiện lỗi qua nhận diện hình ảnh'],
    causes:
      draft.causes.length > 0
        ? draft.causes
        : ['Lỗi phát sinh trên phần mềm hoặc linh kiện thiết bị'],
    steps: draft.steps.map((s, idx) => ({
      stepNumber: idx + 1,
      title: s.title,
      instructions: s.instructions,
      tip: s.tip,
      warning: s.warning,
    })),
    requiredTools: draft.requiredTools,
    tags: Array.from(new Set([...draft.tags, 'gemini-scan', draft.platform])),
    author: 'Mô-đun đề xuất từ Gemini Vision',
    createdAt: new Date().toISOString().split('T')[0],
    helpfulCount: 1,
    isUserSubmitted: true,
  };
}
