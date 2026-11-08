export type Platform = 'all' | 'iphone' | 'android' | 'windows' | 'mac' | 'hardware';

export type Category = 
  | 'all'
  | 'system'     // Hệ thống & Khởi động
  | 'screen'     // Màn hình & Cảm ứng
  | 'battery'    // Pin & Nguồn
  | 'network'    // Mạng & Kết nối (Wi-Fi, Bluetooth, SIM)
  | 'hardware'   // Linh kiện & Phần cứng
  | 'security';  // Mật khẩu & Bảo mật

export type Severity = 'easy' | 'medium' | 'hard';

export interface StepGuide {
  stepNumber: number;
  title: string;
  instructions: string;
  tip?: string;
  warning?: string;
}

export interface Issue {
  id: string;
  title: string;
  platform: 'iphone' | 'android' | 'windows' | 'mac' | 'hardware';
  category: 'system' | 'screen' | 'battery' | 'network' | 'hardware' | 'security';
  severity: Severity;
  estimatedTime: string;
  summary: string;
  symptoms: string[];
  causes: string[];
  steps: StepGuide[];
  requiredTools?: string[];
  tags: string[];
  sourceUrl?: string;
  author: string;
  createdAt: string;
  helpfulCount: number;
  isUserSubmitted?: boolean;
}

export interface IssueFilterOptions {
  query: string;
  platform: Platform;
  category: Category;
  severity: 'all' | Severity;
  onlyBookmarked?: boolean;
  bookmarkedIds?: string[];
}
