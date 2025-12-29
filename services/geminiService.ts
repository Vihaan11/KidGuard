
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisSettings, AnalysisResult } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeScreenshots = async (
  images: File[],
  settings: AnalysisSettings
): Promise<AnalysisResult> => {
  // Always use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imageParts = await Promise.all(
    images.map(async (file) => ({
      inlineData: {
        data: await fileToBase64(file),
        mimeType: file.type,
      },
    }))
  );

  const prompt = `
    Analyze these ${images.length} CCTV screenshots based on these settings:
    - Target: ${settings.primaryTarget}
    - Age: ${settings.ageRange}
    - Focus Activity: ${settings.activityFocus}
    - Detect Location: ${settings.locationDetection ? "Yes" : "No"}

    Please identify which image index (0 to ${images.length - 1}) is best for analysis.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [...imageParts, { text: prompt }] },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          location: { type: Type.STRING, description: "The identified room or area" },
          targetDetected: { type: Type.BOOLEAN, description: "Whether the specified target was found" },
          activityDescription: { type: Type.STRING, description: "Detailed description of what the target is doing" },
          isWatchingScreen: { type: Type.BOOLEAN, description: "True if looking at a device/TV" },
          screenDevice: { type: Type.STRING, description: "Type of device (tablet, phone, tv) or null", nullable: true },
          bestImageIndex: { type: Type.INTEGER, description: "The index of the image analyzed" },
          confidence: { type: Type.NUMBER, description: "Analysis confidence 0-1" },
          additionalNotes: { type: Type.STRING, description: "Any other safety or security observations" }
        },
        required: ["location", "targetDetected", "activityDescription", "bestImageIndex"]
      }
    },
  });

  const resultStr = response.text || "{}";
  return JSON.parse(resultStr) as AnalysisResult;
};
