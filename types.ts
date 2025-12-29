
export interface AnalysisSettings {
  primaryTarget: string;
  ageRange: string;
  activityFocus: string;
  locationDetection: boolean;
}

export interface AnalysisResult {
  location: string;
  targetDetected: boolean;
  activityDescription: string;
  isWatchingScreen: boolean;
  screenDevice: string | null;
  bestImageIndex: number;
  confidence: number;
  additionalNotes: string;
}

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
}
