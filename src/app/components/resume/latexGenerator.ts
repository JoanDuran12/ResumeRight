import { AppState } from "./resumeEditor";

// Add interface for visibility options
export interface VisibilityOptions {
  contactFields: {
    phone: boolean;
    email: boolean;
    website: boolean;
    linkedin: boolean;
    github: boolean;
  };
  sectionVisibility: {
    contact: boolean;
    education: boolean;
    experience: boolean;
    projects: boolean;
    additional: boolean;
  };
}

// Default visibility options (all visible)
const defaultVisibilityOptions: VisibilityOptions = {
  contactFields: {
    phone: true,
    email: true,
    website: true,
    linkedin: true,
    github: true,
  },
  sectionVisibility: {
    contact: true,
    education: true,
    experience: true,
    projects: true,
    additional: true,
  }
};

export const generateLatexResume = (
  state: AppState, 
  visibilityOptions: VisibilityOptions = defaultVisibilityOptions
): string => {
    const { sections, name, contact } = state;
    
    // Escape special LaTeX characters
    const escapeLaTeX = (text: string): string => {
      return text
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/&/g, '\\&')
        .replace(/%/g, '\\%')
        .replace(/\$/g, '\\$')
        .replace(/#/g, '\\#')
        .replace(/_/g, '\\_')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/\^/g, '\\textasciicircum{}');
    };
    
    // Start with document preamble
    let latex = `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[label=$\\bullet$]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
\\begin{document}

`;
  
    // Add Header Section
    latex += `%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLaTeX(name || 'Your Name')}} \\\\ \\vspace{1pt}`;

    // Only add contact information if the contact section is visible
    if (visibilityOptions.sectionVisibility.contact) {
      let contactParts = [];

      // Only add phone if visible
      if (visibilityOptions.contactFields.phone && contact.phone) {
        contactParts.push(escapeLaTeX(contact.phone));
      }
      
      // Only add email if visible
      if (visibilityOptions.contactFields.email && contact.email) {
        contactParts.push(`\\href{mailto:${escapeLaTeX(contact.email)}}{\\underline{${escapeLaTeX(contact.email)}}}`);
      }
      
      // Only add website if visible
      if (visibilityOptions.contactFields.website && contact.website) {
        contactParts.push(`\\href{${escapeLaTeX(contact.website)}}{\\underline{${escapeLaTeX(contact.website.replace(/^https?:\/\//, ''))}}}`);
      }
      
      // Only add LinkedIn if visible
      if (visibilityOptions.contactFields.linkedin && contact.linkedin) {
        const linkedinUrl = contact.linkedin.includes('linkedin.com/in/') 
          ? contact.linkedin 
          : `https://linkedin.com/in/${contact.linkedin}`;
        const displayText = linkedinUrl.replace(/^https?:\/\//, '');
        
        contactParts.push(`\\href{${escapeLaTeX(linkedinUrl)}}{\\underline{${escapeLaTeX(displayText)}}}`);
      }
      
      // Only add GitHub if visible
      if (visibilityOptions.contactFields.github && contact.github) {
        const githubUrl = contact.github.includes('github.com/') 
          ? contact.github 
          : `https://github.com/${contact.github}`;
        const displayText = githubUrl.replace(/^https?:\/\//, '');
        
        contactParts.push(`\\href{${escapeLaTeX(githubUrl)}}{\\underline{${escapeLaTeX(displayText)}}}`);
      }

      // Add contact information with separators if there's any visible contact info
      if (contactParts.length > 0) {
        latex += `
    \\small ${contactParts.join(' $|$ ')}`;
      }
    }
    
    latex += `
\\end{center}

`;
  
    // Add Education Section if it exists and is visible
    if (visibilityOptions.sectionVisibility.education && sections.education.length > 0) {
      latex += `%-----------EDUCATION-----------
\\section{${escapeLaTeX(sections.educationTitle)}}
  \\resumeSubHeadingListStart
`;
  
      sections.education.forEach(edu => {
        // Skip if essential fields are missing
        if (!edu.school && !edu.degree) return;
        
        latex += `    \\resumeSubheading
      {${escapeLaTeX(edu.school || '')}}{${escapeLaTeX(edu.location || '')}}
      {${escapeLaTeX(edu.degree || '')}}{${escapeLaTeX(edu.dates || '')}}`;
        
        // Add category and skills if they exist
        if (edu.category.trim() !== '' || edu.skills.trim() !== '') {
          latex += `
      \\small{\\item{
        \\textbf{${escapeLaTeX(edu.category)}}{: ${escapeLaTeX(edu.skills)}}
      }}`;
        }
      });
  
      latex += `  \\resumeSubHeadingListEnd

`;
    }
  
    // Add Experience Section if it exists and is visible
    if (visibilityOptions.sectionVisibility.experience && sections.experience.length > 0) {
      latex += `%-----------EXPERIENCE-----------
\\section{${escapeLaTeX(sections.experienceTitle)}}
  \\resumeSubHeadingListStart

`;
  
      sections.experience.forEach(exp => {
        // Skip if essential fields are missing
        if (!exp.title && !exp.organization) return;
        
        latex += `    \\resumeSubheading
      {${escapeLaTeX(exp.title || '')}}{${escapeLaTeX(exp.location || '')}}
      {${escapeLaTeX(exp.organization || '')}}{${escapeLaTeX(exp.dates || '')}}`;
        
        // Add bullets if any exist
        const validBullets = exp.bullets.filter(bullet => bullet.text.trim() !== '');
        if (validBullets.length > 0) {
          latex += `
      \\resumeItemListStart`;
          
          validBullets.forEach(bullet => {
            latex += `
        \\resumeItem{${escapeLaTeX(bullet.text)}}`;
          });
          
          latex += `
      \\resumeItemListEnd`;
        }
      });
  
      latex += `  \\resumeSubHeadingListEnd

`;
    }
  
    // Add Projects Section if it exists and is visible
    if (visibilityOptions.sectionVisibility.projects && sections.projects.length > 0) {
      latex += `%-----------PROJECTS-----------
\\section{${escapeLaTeX(sections.projectsTitle)}}
    \\resumeSubHeadingListStart
`;
  
      sections.projects.forEach(project => {
        // Skip if essential fields are missing
        if (!project.name) return;
        
        const projectName = escapeLaTeX(project.name);
        const projectTech = project.tech ? ` $|$ \\emph{${escapeLaTeX(project.tech)}}` : '';
        
        latex += `      \\resumeProjectHeading
          {\\textbf{${projectName}}${projectTech}}{${escapeLaTeX(project.dates || '')}}`;
        
        // Add bullets if any exist
        const validBullets = project.bullets.filter(bullet => bullet.text.trim() !== '');
        if (validBullets.length > 0) {
          latex += `
          \\resumeItemListStart`;
          
          validBullets.forEach(bullet => {
            latex += `
            \\resumeItem{${escapeLaTeX(bullet.text)}}`;
          });
          
          latex += `
          \\resumeItemListEnd`;
        }
      });
  
      latex += `    \\resumeSubHeadingListEnd

`;
    }
  
    // Add Skills Section if it exists and is visible
    const validSkills = sections.skills.filter(skill => skill.category.trim() !== '' || skill.skills.trim() !== '');
    if (visibilityOptions.sectionVisibility.additional && validSkills.length > 0) {
      latex += `%-----------TECHNICAL SKILLS-----------
\\section{${escapeLaTeX(sections.additionalTitle)}}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
`;
  
      validSkills.forEach((skill, index) => {
        if (skill.category.trim() !== '') {
          latex += `     \\textbf{${escapeLaTeX(skill.category)}}{: ${escapeLaTeX(skill.skills)}}`;
          
          // Add line break unless it's the last item
          if (index < validSkills.length - 1) {
            latex += ` \\\\
`;
          }
        } else if (skill.skills.trim() !== '') {
          latex += `     ${escapeLaTeX(skill.skills)}`;
          
          // Add line break unless it's the last item
          if (index < validSkills.length - 1) {
            latex += ` \\\\
`;
          }
        }
      });
  
      latex += `
    }}
 \\end{itemize}

`;
    }
  
    // Close the document
    latex += `%-------------------------------------------
\\end{document}`;
  
    return latex;
  };