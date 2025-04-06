import { AppState } from "./resumeEditor";

export const generateLatexResume = (state: AppState): string => {
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
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
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
    \\textbf{\\Huge \\scshape ${escapeLaTeX(name || 'Your Name')}} \\\\ \\vspace{1pt}
    \\small ${escapeLaTeX(contact.phone || 'Phone')} $|$ \\href{mailto:${escapeLaTeX(contact.email || 'email@example.com')}}{\\underline{${escapeLaTeX(contact.email || 'email@example.com')}}}`;
    
    // Add optional contact links
    if (contact.website) {
      latex += ` $|$ \\href{${escapeLaTeX(contact.website)}}{\\underline{${escapeLaTeX(contact.website.replace(/^https?:\/\//, ''))}}}`;
    }
    
    if (contact.linkedin) {
      const linkedinUrl = contact.linkedin.includes('linkedin.com/in/') 
        ? contact.linkedin 
        : `https://linkedin.com/in/${contact.linkedin}`;
      const displayText = linkedinUrl.replace(/^https?:\/\//, '');
      
      latex += ` $|$ \\href{${escapeLaTeX(linkedinUrl)}}{\\underline{${escapeLaTeX(displayText)}}}`;
    }
    
    // For GitHub - prepend "github.com/" if it doesn't already include it
    if (contact.github) {
      const githubUrl = contact.github.includes('github.com/') 
        ? contact.github 
        : `https://github.com/${contact.github}`;
      const displayText = githubUrl.replace(/^https?:\/\//, '');
      
      latex += ` $|$ \\href{${escapeLaTeX(githubUrl)}}{\\underline{${escapeLaTeX(displayText)}}}`;
    }
    
    latex += `
\\end{center}

`;
  
    // Add Education Section if it exists
    if (sections.education.length > 0) {
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
        
        // Add bullets if any exist
        const validBullets = edu.bullets.filter(bullet => bullet.text.trim() !== '');
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
  
    // Add Experience Section if it exists
    if (sections.experience.length > 0) {
      latex += `%-----------EXPERIENCE-----------
\\section{${escapeLaTeX(sections.experienceTitle)}}
  \\resumeSubHeadingListStart

`;
  
      sections.experience.forEach(exp => {
        // Skip if essential fields are missing
        if (!exp.title && !exp.organization) return;
        
        latex += `    \\resumeSubheading
      {${escapeLaTeX(exp.organization || '')}}{${escapeLaTeX(exp.location || '')}}
      {${escapeLaTeX(exp.title || '')}}{${escapeLaTeX(exp.dates || '')}}`;
        
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
  
    // Add Projects Section if it exists
    if (sections.projects.length > 0) {
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
  
    // Add Skills Section if it exists
    const validSkills = sections.skills.filter(skill => skill.category.trim() !== '' || skill.skills.trim() !== '');
    if (validSkills.length > 0) {
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