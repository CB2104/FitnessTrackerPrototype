import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const analyzeImage = async (filePath: string) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const imageData = fs.readFileSync(filePath, {
      encoding: "base64",
    });

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData,
        },
      },
      {
        text: `Analyze this food image. Return ONLY a valid JSON object with exactly these fields:
{
  "name": "name of the food",
  "calories": estimated_calories_as_number
}

Do not include any markdown formatting, code blocks, or additional text. Only return the raw JSON object.`,
      },
    ]);

    const response = await result.response;
    const text = response.text();

    let cleanedText = text.trim();

    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    }

    const parsed = JSON.parse(cleanedText);

    if (!parsed.name || typeof parsed.calories !== "number") {
      throw new Error("Invalid response format from Gemini");
    }

    return parsed;
  } catch (error: any) {
    console.error("Gemini error:", error.message);
    throw error;
  }
};
