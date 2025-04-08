'use client';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
);

const modelName = "gemini-1.5-flash"; // Default model for Gemini API
const model = genAI.getGenerativeModel({ model: modelName });

// Define interface for the response
export interface BulletPointResponse {
  bullet: string;
}

// Safely get job description from localStorage (client-side only)
const getJobDescription = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("jobDescription") || "";
  }
  return "";
};

/**
 * Rewrites a resume bullet point to be more impactful
 * @param {string} bulletPoint - The original resume bullet point
 * @returns {Promise<BulletPointResponse>} - JSON with improved version
 */
export async function RewriteResumeBullet(bulletPoint: string): Promise<BulletPointResponse> {
  const jobDescription = getJobDescription();
  
  const prompt = `
    You will rewrite the following resume bullet point to be more impactful to the job the user is applying to.

    Job description: "${jobDescription}"
    
    Original bullet point: "${bulletPoint}" Use it as reference only not to add on it.
    
    Generate your response following exactly this JSON schema with no additional text:
    {
      "bullet": "A rewritten version that is more impactful, quantifiable, and achievement-focused",
    }
    
    Limitations:
    - The rewritten bullet point should be tailored to the job description provided.
    - It should be more impactful, quantifiable, and achievement-focused.
    - 2 sentences max and keep it concise.
    - Use short and clear sentences.
    - Avoid using examples or explanations.
    - DO NOT include any final periods to sentences.


    Important: Return ONLY valid JSON that matches this schema with no explanation or markdown formatting.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const response = result.response;
    // Clean the response as a fallback
    let cleanedResponse = response.text().trim();
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, "");
    cleanedResponse = cleanedResponse.replace(/```\s*/g, "");

    // Parse the cleaned JSON
    return JSON.parse(cleanedResponse) as BulletPointResponse;
  } catch (error) {
    console.error("Error rewriting resume bullet point:", error);
    throw error;
  }
} 