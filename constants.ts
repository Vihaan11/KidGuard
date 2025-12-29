
import { AnalysisSettings } from './types';

export const DEFAULT_SETTINGS: AnalysisSettings = {
  primaryTarget: "Little girl",
  ageRange: "4 to 6 years",
  activityFocus: "Watching cartoons on tablet, TV, or mobile phone",
  locationDetection: true
};

export const SYSTEM_INSTRUCTION = `You are an expert Security and Activity Analyst AI. 
Your task is to analyze multiple screenshots from a CCTV camera system.

Rules:
1. Identify the room/location (e.g., Bedroom, Kitchen, Living Room).
2. Look for the Primary Target specified in settings.
3. If the target is present, describe their exact activity.
4. Pay CRITICAL attention to screen usage (Tablet, TV, Phone).
5. If multiple images are provided, select the SINGLE image that most clearly shows the target or the most significant activity. Return the 0-indexed position of that image.

Output must be in JSON format.`;
