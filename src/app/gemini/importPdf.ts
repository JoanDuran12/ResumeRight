'use client';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { AppState } from "@/app/components/resume/resumeEditor";
import { ResumeContent } from "@/app/services/resumeService";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
);

const modelName = "gemini-1.5-flash"; // Fast model for PDF processing
const model = genAI.getGenerativeModel({ model: modelName });

/**
 * Checks if the provided file is a valid PDF
 */
export async function isPdf(file: File): Promise<boolean> {
  // Check MIME type
  if (file.type !== 'application/pdf') {
    return false;
  }
  
  // Read the first few bytes to confirm it's a PDF
  try {
    const buffer = await file.arrayBuffer();
    const header = new Uint8Array(buffer.slice(0, 5));
    // PDF files start with %PDF-
    const headerString = String.fromCharCode(...header);
    return headerString === '%PDF-';
  } catch (error) {
    console.error("Error checking PDF validity:", error);
    return false;
  }
}

/**
 * Improved function to import PDF and extract resume data
 */
export async function importPdf(formData: FormData): Promise<AppState> {
  try {
    // Validate the file exists in the form data
    const pdfFile = formData.get("file") as File;
    if (!pdfFile) {
      throw new Error("No file provided");
    }
    
    // Verify it's a PDF file
    const isPdfValid = await isPdf(pdfFile);
    if (!isPdfValid) {
      throw new Error("Invalid PDF file");
    }
    
    // Convert file to buffer for processing
    const buffer = await pdfFile.arrayBuffer();
    const fileData = new Uint8Array(buffer);
    
    // Convert binary data to base64 for Gemini API
    const base64Data = Buffer.from(fileData).toString('base64');
    
    // Create a simplified schema example to guide the model
    const exampleOutput = {
      name: "John Smith",
      contact: {
        phone: "555-123-4567",
        email: "john.smith@example.com",
        website: "johnsmith.com",
        linkedin: "johnsmith", // Note: just username without linkedin.com/in/
        github: "jsmith" // Note: just username without github.com/
      },
      sections: {
        education: [
          {
            id: "edu-1",
            school: "Stanford University",
            degree: "Bachelor of Science in Computer Science",
            location: "Stanford, CA",
            dates: "August 2018 - May 2022",
            category: "Education",
            skills: "Algorithms, Data Structures, Machine Learning"
          }
        ],
        experience: [
          {
            id: "exp-1",
            title: "Software Engineer",
            organization: "Tech Company",
            location: "San Francisco, CA",
            dates: "June 2022 - Present",
            bullets: [
              {
                id: "bullet-1",
                text: "Developed and maintained RESTful APIs using Node.js and Express"
              },
              {
                id: "bullet-2",
                text: "Implemented authentication and authorization using JWT"
              }
            ]
          }
        ],
        projects: [
          {
            id: "proj-1",
            name: "AI Resume Parser",
            tech: "React, Node.js, Gemini API",
            dates: "January 2023 - March 2023",
            bullets: [
              {
                id: "bullet-1",
                text: "Built a resume parsing tool using AI to extract structured data"
              }
            ]
          }
        ],
        skills: [
          {
            id: "skill-1",
            category: "Programming Languages",
            skills: "JavaScript, TypeScript, Python, Java"
          }
        ],
        educationTitle: "Education",
        experienceTitle: "Experience",
        projectsTitle: "Projects",
        additionalTitle: "Additional Information"
      }
    };
    
    // Create an improved prompt for the Gemini model
    const systemPrompt = `
      Task: Extract structured resume data from this PDF.
      
      Instructions:
      - Extract the person's full name, contact details, education, work experience, projects, and skills.
      - For each job experience and project, extract bullet points describing responsibilities and achievements.
      - Format dates as "Month Year - Month Year" or "Month Year - Present"
      - Generate a random UUID as ID for each section item and bullet point.
      - If information is missing or unclear, use an empty string.
      - Format text case properly:
        * For names and section titles (like "Experience", "Education", "Skills"), capitalize only the first letter of each word
        * Convert all-uppercase text like "BEN SMITH" to proper case "Ben Smith"
        * Convert all-uppercase section titles like "EXPERIENCE" to "Experience"
        * Maintain capitalization for acronyms like "CEO", "AWS", "UI/UX", etc.
      - For LinkedIn URLs:
        * If you see a full URL (e.g., "linkedin.com/in/username"), extract just the username part
        * If you see just a username, extract that
        * Store only the username part in the contact.linkedin field (without "linkedin.com/in/")
      - For GitHub URLs:
        * If you see a full URL (e.g., "github.com/username"), extract just the username part
        * If you see just a username, extract that
        * Store only the username part in the contact.github field (without "github.com/")
      - For websites, store the full URL including http:// or https:// if provided
      - The output MUST be valid JSON that exactly matches the schema shown in the example below.
      - DO NOT include any explanation or markdown formatting - return ONLY the JSON object.
      - DO NOT include any final periods to sentences
      
      Expected JSON format:
      ${JSON.stringify(exampleOutput, null, 2)}
    `;
    
    console.log("Sending PDF to Gemini API for extraction...");
    
    // Use Gemini model to process the PDF with the improved prompt
    const result = await model.generateContent({
      contents: [
        { 
          role: "user", 
          parts: [
            { text: systemPrompt },
            { 
              inlineData: { 
                mimeType: "application/pdf", 
                data: base64Data 
              } 
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1, // Lower temperature for more deterministic output
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
    
    // Process response
    const response = result.response;
    let responseText = response.text().trim();
    
    // Log response for debugging
    console.log("Received response from Gemini API");
    
    // Log the first 100 characters of the response for debugging
    console.log("Response preview:", responseText.substring(0, 100) + (responseText.length > 100 ? "..." : ""));
    
    // Clean up response text to ensure valid JSON
    let cleanedResponse = responseText;
    
    // More robust cleanup process:
    // Remove markdown code blocks
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, "");
    cleanedResponse = cleanedResponse.replace(/```\s*/g, "");
    
    // Find the first { and last } to extract just the JSON object
    const startIdx = cleanedResponse.indexOf('{');
    const endIdx = cleanedResponse.lastIndexOf('}');
    
    if (startIdx >= 0 && endIdx >= 0 && endIdx > startIdx) {
      cleanedResponse = cleanedResponse.substring(startIdx, endIdx + 1);
    }
    
    console.log("Attempting to parse JSON response...");
    
    try {
      // Parse the cleaned response
      const parsedData = JSON.parse(cleanedResponse) as AppState;
      
      // Process social media links before validation
      processContactLinks(parsedData);
      
      // Format text case
      formatTextCase(parsedData);
      
      // Validate and fix the parsed data
      validateAndFixAppState(parsedData);
      
      console.log("Successfully parsed and validated resume data");
      return parsedData;
      
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError);
      console.error("Failed JSON string:", cleanedResponse);
      
      // If JSON parsing fails, create a minimal valid AppState
      console.log("Creating fallback AppState structure");
      return createDefaultAppState();
    }
  } catch (error) {
    console.error("Error importing PDF:", error);
    throw error;
  }
}

/**
 * Creates a default AppState with empty values when extraction fails
 */
function createDefaultAppState(): AppState {
  return {
    name: '',
    contact: {
      phone: '',
      email: '',
      website: '',
      linkedin: '',
      github: '',
    },
    sections: {
      education: [
        {
          id: crypto.randomUUID(),
          school: '',
          degree: '',
          location: '',
          dates: '',
          category: '',
          skills: ''
        }
      ],
      experience: [
        {
          id: crypto.randomUUID(),
          title: '',
          organization: '',
          location: '',
          dates: '',
          bullets: [
            { id: crypto.randomUUID(), text: '' }
          ]
        }
      ],
      projects: [
        {
          id: crypto.randomUUID(),
          name: '',
          tech: '',
          dates: '',
          bullets: [
            { id: crypto.randomUUID(), text: '' }
          ]
        }
      ],
      skills: [
        {
          id: crypto.randomUUID(),
          category: '',
          skills: ''
        }
      ],
      educationTitle: 'Education',
      experienceTitle: 'Experience',
      projectsTitle: 'Projects',
      additionalTitle: 'Additional'
    }
  };
}

/**
 * Post-processes the social media links in the AppState
 */
function processContactLinks(state: AppState): void {
  if (!state || !state.contact) return;
  
  // Process LinkedIn URL
  if (state.contact.linkedin) {
    // Extract username from LinkedIn URL if it contains the full URL
    if (state.contact.linkedin.includes('linkedin.com/in/')) {
      const parts = state.contact.linkedin.split('linkedin.com/in/');
      state.contact.linkedin = parts[parts.length - 1].replace(/\/$/, ''); // Remove trailing slash if any
    } else if (state.contact.linkedin.includes('linkedin.com/')) {
      const parts = state.contact.linkedin.split('linkedin.com/');
      state.contact.linkedin = parts[parts.length - 1].replace(/\/$/, '');
    }
    // Clean up any http:// or https:// prefixes
    state.contact.linkedin = state.contact.linkedin.replace(/^https?:\/\//, '');
  }
  
  // Process GitHub URL
  if (state.contact.github) {
    // Extract username from GitHub URL if it contains the full URL
    if (state.contact.github.includes('github.com/')) {
      const parts = state.contact.github.split('github.com/');
      state.contact.github = parts[parts.length - 1].replace(/\/$/, ''); // Remove trailing slash if any
    }
    // Clean up any http:// or https:// prefixes
    state.contact.github = state.contact.github.replace(/^https?:\/\//, '');
  }
}

/**
 * Properly formats text case in the AppState
 */
function formatTextCase(state: AppState): void {
  if (!state) return;
  
  // Helper function to convert text to proper case
  const toProperCase = (text: string): string => {
    if (!text) return '';
    
    // Skip formatting if it contains slashes or appears to be an acronym
    if (text.includes('/') || text.split(' ').some(word => word.length <= 3 && word === word.toUpperCase())) {
      return text;
    }
    
    return text.replace(/\w\S*/g, (word) => {
      // Don't lowercase things that appear to be acronyms
      if (word.length <= 3 && word === word.toUpperCase()) return word;
      return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
    });
  };
  
  // Format name
  state.name = toProperCase(state.name);
  
  // Format section titles
  if (state.sections) {
    if (state.sections.educationTitle) {
      state.sections.educationTitle = toProperCase(state.sections.educationTitle);
    }
    if (state.sections.experienceTitle) {
      state.sections.experienceTitle = toProperCase(state.sections.experienceTitle);
    }
    if (state.sections.projectsTitle) {
      state.sections.projectsTitle = toProperCase(state.sections.projectsTitle);
    }
    if (state.sections.additionalTitle) {
      state.sections.additionalTitle = toProperCase(state.sections.additionalTitle);
    }
    
    // Format education fields
    state.sections.education?.forEach(edu => {
      if (edu.school) edu.school = toProperCase(edu.school);
      if (edu.degree) edu.degree = toProperCase(edu.degree);
      if (edu.location) edu.location = toProperCase(edu.location);
      if (edu.category) edu.category = toProperCase(edu.category);
    });
    
    // Format experience fields
    state.sections.experience?.forEach(exp => {
      if (exp.title) exp.title = toProperCase(exp.title);
      if (exp.organization) exp.organization = toProperCase(exp.organization);
      if (exp.location) exp.location = toProperCase(exp.location);
    });
    
    // Format project fields
    state.sections.projects?.forEach(proj => {
      if (proj.name) proj.name = toProperCase(proj.name);
    });
    
    // Format skills categories
    state.sections.skills?.forEach(skill => {
      if (skill.category) {
        skill.category = toProperCase(skill.category);
      }
    });
  }
}

/**
 * Validates the AppState and ensures all required fields exist
 */
function validateAndFixAppState(state: AppState): void {
  if (!state) {
    throw new Error("Invalid state: state is null or undefined");
  }

  // Ensure all required sections exist
  if (!state.sections) state.sections = {} as any;
  if (!state.name) state.name = '';
  if (!state.contact) state.contact = {} as any;
  
  // Ensure section titles
  if (!state.sections.additionalTitle) state.sections.additionalTitle = 'Additional';
  if (!state.sections.educationTitle) state.sections.educationTitle = 'Education';
  if (!state.sections.experienceTitle) state.sections.experienceTitle = 'Experience';
  if (!state.sections.projectsTitle) state.sections.projectsTitle = 'Projects';
  
  // Ensure arrays exist
  if (!state.sections.education) state.sections.education = [];
  if (!state.sections.experience) state.sections.experience = [];
  if (!state.sections.projects) state.sections.projects = [];
  if (!state.sections.skills) state.sections.skills = [];
  
  // Ensure each array has at least one item with valid ID
  if (state.sections.education.length === 0) {
    state.sections.education.push({
      id: crypto.randomUUID(),
      school: '',
      degree: '',
      location: '',
      dates: '',
      category: '',
      skills: ''
    });
  }
  
  if (state.sections.experience.length === 0) {
    state.sections.experience.push({
      id: crypto.randomUUID(),
      title: '',
      organization: '',
      location: '',
      dates: '',
      bullets: [
        { id: crypto.randomUUID(), text: '' }
      ]
    });
  }
  
  if (state.sections.projects.length === 0) {
    state.sections.projects.push({
      id: crypto.randomUUID(),
      name: '',
      tech: '',
      dates: '',
      bullets: [
        { id: crypto.randomUUID(), text: '' }
      ]
    });
  }
  
  if (state.sections.skills.length === 0) {
    state.sections.skills.push({
      id: crypto.randomUUID(),
      category: '',
      skills: ''
    });
  }
  
  // Ensure every item has an ID and all expected properties
  state.sections.education.forEach(edu => {
    if (!edu.id) edu.id = crypto.randomUUID();
    if (!edu.school) edu.school = '';
    if (!edu.degree) edu.degree = '';
    if (!edu.location) edu.location = '';
    if (!edu.dates) edu.dates = '';
    if (!edu.category) edu.category = '';
    if (!edu.skills) edu.skills = '';
  });
  
  state.sections.experience.forEach(exp => {
    if (!exp.id) exp.id = crypto.randomUUID();
    if (!exp.title) exp.title = '';
    if (!exp.organization) exp.organization = '';
    if (!exp.location) exp.location = '';
    if (!exp.dates) exp.dates = '';
    if (!exp.bullets) exp.bullets = [];
    if (exp.bullets.length === 0) {
      exp.bullets.push({ id: crypto.randomUUID(), text: '' });
    }
    exp.bullets.forEach(bullet => {
      if (!bullet.id) bullet.id = crypto.randomUUID();
      if (!bullet.text) bullet.text = '';
    });
  });
  
  state.sections.projects.forEach(project => {
    if (!project.id) project.id = crypto.randomUUID();
    if (!project.name) project.name = '';
    if (!project.tech) project.tech = '';
    if (!project.dates) project.dates = '';
    if (!project.bullets) project.bullets = [];
    if (project.bullets.length === 0) {
      project.bullets.push({ id: crypto.randomUUID(), text: '' });
    }
    project.bullets.forEach(bullet => {
      if (!bullet.id) bullet.id = crypto.randomUUID();
      if (!bullet.text) bullet.text = '';
    });
  });
  
  state.sections.skills.forEach(skill => {
    if (!skill.id) skill.id = crypto.randomUUID();
    if (!skill.category) skill.category = '';
    if (!skill.skills) skill.skills = '';
  });
  
  // Ensure contact fields exist
  if (!state.contact.phone) state.contact.phone = '';
  if (!state.contact.email) state.contact.email = '';
  if (!state.contact.website) state.contact.website = '';
  if (!state.contact.linkedin) state.contact.linkedin = '';
  if (!state.contact.github) state.contact.github = '';
}

/**
 * Parses a PDF file and returns a structured AppState object
 * Main function to be called from components
 */
export async function parsePdf(formData: FormData): Promise<AppState> {
  try {
    console.log("Starting PDF parsing process");
    return await importPdf(formData);
  } catch (error) {
    console.error("Error in parsePdf:", error);
    // Return default AppState on error instead of throwing
    return createDefaultAppState();
  }
}

/**
 * Converts an AppState object to a ResumeContent object for database storage
 */
export function convertAppStateToResumeContent(appState: AppState): ResumeContent {
  return {
    personalInfo: {
      name: appState.name,
      email: appState.contact.email,
      phone: appState.contact.phone,
      website: appState.contact.website,
      linkedin: appState.contact.linkedin,
      github: appState.contact.github,
    },
    education: appState.sections.education.map(edu => ({
      id: edu.id,
      school: edu.school,
      degree: edu.degree,
      location: edu.location,
      date: edu.dates,
      category: edu.category,
      skills: edu.skills,
    })),
    experience: appState.sections.experience.map(exp => ({
      id: exp.id,
      company: exp.organization,
      title: exp.title,
      location: exp.location,
      startDate: exp.dates.split(' - ')[0] || '',
      endDate: exp.dates.split(' - ')[1] || exp.dates,
      bullets: exp.bullets.map(bullet => ({
        id: bullet.id,
        text: bullet.text,
      })),
    })),
    projects: appState.sections.projects.map(proj => ({
      id: proj.id,
      name: proj.name,
      tech: proj.tech,
      dates: proj.dates,
      bullets: proj.bullets.map(bullet => ({
        id: bullet.id,
        text: bullet.text,
      })),
    })),
    skills: appState.sections.skills.map(skill => ({
      id: skill.id,
      category: skill.category,
      skills: skill.skills,
    })),
    sectionTitles: {
      educationTitle: appState.sections.educationTitle,
      experienceTitle: appState.sections.experienceTitle,
      projectsTitle: appState.sections.projectsTitle,
      additionalTitle: appState.sections.additionalTitle,
    },
  };
}

/**
 * Converts a ResumeContent object to an AppState object for the editor
 */
export function convertResumeContentToAppState(resumeContent: ResumeContent): AppState {
  // Process LinkedIn URL: Check if it already has the prefix
  let linkedinValue = resumeContent.personalInfo.linkedin || '';
  if (linkedinValue && !linkedinValue.includes('linkedin.com/in/') && !linkedinValue.startsWith('http')) {
    linkedinValue = linkedinValue.trim();
  }
  
  // Process GitHub URL: Check if it already has the prefix
  let githubValue = resumeContent.personalInfo.github || '';
  if (githubValue && !githubValue.includes('github.com/') && !githubValue.startsWith('http')) {
    githubValue = githubValue.trim();
  }
  
  return {
    name: resumeContent.personalInfo.name,
    contact: {
      phone: resumeContent.personalInfo.phone || '',
      email: resumeContent.personalInfo.email || '',
      website: resumeContent.personalInfo.website || '',
      linkedin: linkedinValue,
      github: githubValue,
    },
    sections: {
      education: resumeContent.education.map(edu => ({
        id: edu.id,
        school: edu.school,
        degree: edu.degree,
        location: edu.location,
        dates: edu.date,
        category: edu.category || '',
        skills: edu.skills || '',
      })),
      experience: resumeContent.experience.map(exp => ({
        id: exp.id,
        title: exp.title,
        organization: exp.company,
        location: exp.location,
        dates: `${exp.startDate}${exp.startDate && exp.endDate ? ' - ' : ''}${exp.endDate}`,
        bullets: exp.bullets.map(bullet => ({
          id: bullet.id,
          text: bullet.text,
        })),
      })),
      projects: resumeContent.projects.map(proj => ({
        id: proj.id,
        name: proj.name,
        tech: proj.tech,
        dates: proj.dates,
        bullets: proj.bullets.map(bullet => ({
          id: bullet.id,
          text: bullet.text,
        })),
      })),
      skills: resumeContent.skills.map(skill => ({
        id: skill.id,
        category: skill.category,
        skills: skill.skills,
      })),
      educationTitle: resumeContent.sectionTitles.educationTitle,
      experienceTitle: resumeContent.sectionTitles.experienceTitle,
      projectsTitle: resumeContent.sectionTitles.projectsTitle,
      additionalTitle: resumeContent.sectionTitles.additionalTitle,
    },
  };
}

/**
 * Imports a PDF and directly converts it to ResumeContent format
 */
export async function importPdfAsResumeContent(formData: FormData): Promise<ResumeContent> {
  const appState = await parsePdf(formData);
  return convertAppStateToResumeContent(appState);
}