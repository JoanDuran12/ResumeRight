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
  const hasJobDescription = jobDescription.trim().length > 0;
  
  const prompt = `
    You are an expert resume writer with years of experience helping job seekers land interviews.
    
    Your task is to transform the following resume bullet point into a high-impact achievement statement${hasJobDescription ? " that perfectly aligns with the target job description" : ""}.

    ${hasJobDescription ? `TARGET JOB DESCRIPTION:
    """
    ${jobDescription}
    """
    ` : "No job description provided. Focus on creating a universally strong bullet point that highlights impact and achievements."}
    
    ORIGINAL BULLET POINT:
    """
    ${bulletPoint}
    """
    
    GUIDELINES FOR TRANSFORMATION:
    1. Begin with a strong action verb in the past tense
    2. Emphasize measurable outcomes and quantifiable achievements wherever possible (add realistic metrics if none exist)
    3. Follow the PAR formula: Problem/Project → Action → Result
    4. Demonstrate impact using metrics, percentages, or specific improvements
    5. Highlight relevant skills and technologies${hasJobDescription ? " that align with the job description" : ""}
    6. Remove filler words and unnecessary details
    7. Be concise and impactful - limit to 1-2 sentences with no periods at the end
    ${hasJobDescription ? "8. Incorporate relevant keywords from the job description naturally" : ""}
    
    Generate your response following exactly this JSON schema with no additional text:
    {
      "bullet": "The transformed high-impact resume bullet"
    }
    
    IMPORTANT: 
    - Return ONLY valid JSON matching this schema with no explanation or markdown
    - Never exceed 2 sentences
    - Never include final periods
    - Use concrete, specific language
    - Focus on achievements rather than responsibilities
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 200,
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