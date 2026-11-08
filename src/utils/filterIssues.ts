import { Issue, IssueFilterOptions } from '../types/issue';

/**
 * Remove Vietnamese accents and convert to lowercase for flexible search
 */
export function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Filter and search issues by query, platform, category, severity, and bookmarks
 */
export function filterIssues(issues: Issue[], options: IssueFilterOptions): Issue[] {
  const { query, platform, category, severity, onlyBookmarked, bookmarkedIds = [] } = options;
  const cleanQuery = removeVietnameseTones(query);

  return issues.filter((issue) => {
    // 1. Platform filter
    if (platform !== 'all' && issue.platform !== platform) {
      return false;
    }

    // 2. Category filter
    if (category !== 'all' && issue.category !== category) {
      return false;
    }

    // 3. Severity filter
    if (severity !== 'all' && issue.severity !== severity) {
      return false;
    }

    // 4. Bookmark filter
    if (onlyBookmarked && !bookmarkedIds.includes(issue.id)) {
      return false;
    }

    // 5. Query search (matched against title, summary, symptoms, causes, tags, and step titles)
    if (cleanQuery) {
      const matchTitle = removeVietnameseTones(issue.title).includes(cleanQuery);
      const matchSummary = removeVietnameseTones(issue.summary).includes(cleanQuery);
      const matchTags = issue.tags.some((tag) => removeVietnameseTones(tag).includes(cleanQuery));
      const matchSymptoms = issue.symptoms.some((s) => removeVietnameseTones(s).includes(cleanQuery));
      const matchCauses = issue.causes.some((c) => removeVietnameseTones(c).includes(cleanQuery));
      const matchSteps = issue.steps.some(
        (st) =>
          removeVietnameseTones(st.title).includes(cleanQuery) ||
          removeVietnameseTones(st.instructions).includes(cleanQuery)
      );

      if (!matchTitle && !matchSummary && !matchTags && !matchSymptoms && !matchCauses && !matchSteps) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Validate a user-contributed issue
 */
export function validateIssueForm(data: {
  title: string;
  summary: string;
  causes: string[];
  steps: { title: string; instructions: string }[];
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.title.trim()) {
    errors.title = 'Vui lòng nhập tiêu đề sự cố.';
  } else if (data.title.trim().length < 5) {
    errors.title = 'Tiêu đề cần ít nhất 5 ký tự.';
  }

  if (!data.summary.trim()) {
    errors.summary = 'Vui lòng nhập tóm tắt ngắn về sự cố.';
  }

  const validCauses = data.causes.filter((c) => c.trim().length > 0);
  if (validCauses.length === 0) {
    errors.causes = 'Vui lòng nêu ít nhất 1 nguyên nhân.';
  }

  const validSteps = data.steps.filter((s) => s.title.trim() && s.instructions.trim());
  if (validSteps.length === 0) {
    errors.steps = 'Vui lòng thêm ít nhất 1 bước hướng dẫn khắc phục cụ thể.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
