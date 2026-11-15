export type DetectedPlatform = 'iphone' | 'android' | 'windows' | 'mac' | 'hardware';

export interface SuggestedModuleDraft {
  title: string;
  platform: DetectedPlatform;
  category: 'system' | 'screen' | 'battery' | 'network' | 'hardware' | 'security';
  severity: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  summary: string;
  symptoms: string[];
  causes: string[];
  requiredTools?: string[];
  steps: {
    title: string;
    instructions: string;
    tip?: string;
    warning?: string;
  }[];
  tags: string[];
}

export interface GeminiDiagnosisResult {
  isDeviceErrorDetected: boolean;
  detectedPlatform: DetectedPlatform;
  detectedIssueTitle: string;
  confidence: number;
  visualObservations: string[];
  errorCodeOrText?: string;
  matchedIssueIds: string[];
  reasonForRecommendation: string;
  suggestedModule?: SuggestedModuleDraft;
}

export interface IssueCatalogSummary {
  id: string;
  title: string;
  platform: DetectedPlatform;
  category: 'system' | 'screen' | 'battery' | 'network' | 'hardware' | 'security';
  summary: string;
  tags: string[];
}
