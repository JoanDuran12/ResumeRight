const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const pdfParse = require("pdf-parse");

// Configuration
const GEMINI_API_KEY = "AIzaSyAjQBGs_w3EDyBClGM6zlgs9ivtqlBChBA"; // Set this in your environment variables
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables");
  process.exit(1);
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Resume JSON template
const resumeTemplate = {
  basicInfo: {
    name: "",
    contact: {
      phone: "",
      email: "",
      linkedin: "",
      github: "",
      website: "",
    },
  },
  education: [
    {
      school: "",
      location: "",
      degree: "",
      dates: "",
    },
  ],
  experience: [
    {
      title: "",
      location: "",
      organization: "",
      dates: "",
      bullets: [],
    },
  ],
  projects: [
    {
      name: "",
      tech: "",
      dates: "",
      bullets: [""],
    },
  ],
  skills: [
    {
      category: "",
      skills: "",
    },
  ],
};

/**
 * Extracts text content from a PDF file
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<string>} - Text content of the PDF
 */
async function extractTextFromPDF(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw error;
  }
}

/**
 * Processes resume text using Gemini API
 * @param {string} resumeText - Text content of the resume
 * @returns {Promise<Object>} - Parsed resume data in JSON format
 */
async function processResumeWithGemini(resumeText) {
  try {
    // Generate the prompt for Gemini
    const prompt = `
    I need you to parse the following resume text into a structured JSON format.
    Follow these rules:
    1. Extract all relevant information based on the sections
    2. Format the data according to the template provided below
    3. Keep bullets concise and relevant
    4. Include all contact details found in the resume
    5. Return only valid JSON with no explanations or additional text
    
    The template structure is:
    ${JSON.stringify(resumeTemplate, null, 2)}
    
    Here's the resume text to parse:
    ${resumeText}
    `;

    // Get response from Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Extract JSON from response
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) ||
      responseText.match(/```\n([\s\S]*?)\n```/) || [null, responseText];

    const jsonContent = jsonMatch[1];

    try {
      return JSON.parse(jsonContent);
    } catch (parseError) {
      console.error("Error parsing JSON from Gemini response:", parseError);
      console.log("Raw response:", responseText);
      throw parseError;
    }
  } catch (error) {
    console.error("Error processing resume with Gemini:", error);
    throw error;
  }
}

/**
 * Main function to parse a PDF resume
 * @param {string} pdfPath - Path to the PDF file
 * @returns {Promise<Object>} - Parsed resume data in JSON format
 */
async function parseResume(pdfPath) {
  try {
    // 1. Extract text from PDF
    const resumeText = await extractTextFromPDF(pdfPath);

    // 2. Process resume with Gemini API
    const parsedResume = await processResumeWithGemini(resumeText);

    return parsedResume;
  } catch (error) {
    console.error("Error parsing resume:", error);
    throw error;
  }
}

/**
 * CLI entry point
 */
async function main() {
  try {
    if (process.argv.length < 3) {
      console.error("Usage: node resume-parser.js <path-to-pdf>");
      process.exit(1);
    }

    const pdfPath = "./Joan Duran's Resume V2.pdf";
    if (!fs.existsSync(pdfPath)) {
      console.error(`File not found: ${pdfPath}`);
      process.exit(1);
    }

    console.log(`Parsing resume from: ${pdfPath}`);
    const parsedResume = await parseResume(pdfPath);

    // Output results
    console.log(JSON.stringify(parsedResume, null, 2));

    // Optionally save to file
    const outputPath = path.join(
      path.dirname(pdfPath),
      `${path.basename(pdfPath, ".pdf")}-parsed.json`
    );
    fs.writeFileSync(outputPath, JSON.stringify(parsedResume, null, 2));
    console.log(`Results saved to: ${outputPath}`);
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

// Run the script
main();
