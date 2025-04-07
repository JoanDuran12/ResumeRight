import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

const model = "gemini-1.5-flash"; // Default model for Gemini API

const savedJobDescription = localStorage.getItem("jobDescription"); // Retrieve the job description from local storage

/**
 * Rewrites a resume bullet point to be more impactful
 * @param {string} bulletPoint - The original resume bullet point
 * @returns {Promise<Object>} - JSON with original and improved versions
 */
export async function RewriteResumeBullet(bulletPoint) {
  const prompt = `
    You will rewrite the following resume bullet point to be more impactful to the job the user is applying to.

    Job description: "${savedJobDescription}"
    
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

    Important: Return ONLY valid JSON that matches this schema with no explanation or markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      generationConfig: {
        responseFormat: { type: "json" }, // Try requesting JSON format explicitly
      },
    });

    // Clean the response as a fallback
    let cleanedResponse = response.text.trim();
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, "");
    cleanedResponse = cleanedResponse.replace(/```\s*/g, "");

    // Parse the cleaned JSON
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Error rewriting resume bullet point:", error);
    console.error("Raw response:", response?.text);
    throw error;
  }
}
