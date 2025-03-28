import React, { useState } from 'react';
import styles from '@/app/resume.module.css';
import ResumeHeader from './components/ResumeHeader';
import EducationSection from './components/EducationSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';

// Interfaces for our data types
interface Education {
  school: string;
  location: string;
  degree: string;
  dates: string;
}

interface Experience {
  title: string;
  location: string;
  organization: string;
  dates: string;
  bullets: string[];
}

interface Project {
  name: string;
  tech: string;
  dates: string;
  bullets: string[];
}

interface Skills {
  languages: string;
  frameworks: string;
  tools: string;
  libraries: string;
}

interface Contact {
  phone: string;
  email: string;
  linkedin: string;
  github: string;
}

const EditableResume: React.FC = () => {
  // Basic info state
  const [name, setName] = useState("Jake Ryan");
  const [contact, setContact] = useState({
    phone: "123-456-7890",
    email: "jake@su.edu",
    linkedin: "linkedin.com/in/jake",
    github: "github.com/jake"
  });
  
  // Education state
  const [education, setEducation] = useState<Education[]>([
    {
      school: "Southwestern University",
      location: "Georgetown, TX",
      degree: "Bachelor of Arts in Computer Science, Minor in Business",
      dates: "Aug. 2018 - May 2021"
    },
    {
      school: "Blinn College",
      location: "Bryan, TX",
      degree: "Associate's in Liberal Arts",
      dates: "Aug. 2014 - May 2018"
    }
  ]);
  
  // Experience state
  const [experience, setExperience] = useState<Experience[]>([
    {
      title: "Undergraduate Research Assistant",
      location: "College Station, TX",
      organization: "Texas A&M University",
      dates: "June 2020 - Present",
      bullets: [
        "Developed a REST API using FastAPI and PostgreSQL to store data from learning management systems",
        "Developed a full-stack web application using Flask, React, PostgreSQL and Docker to analyze GitHub data",
        "Explored ways to visualize GitHub collaboration in a classroom setting"
      ]
    },
    {
      title: "Information Technology Support Specialist",
      location: "Georgetown, TX",
      organization: "Southwestern University",
      dates: "Sep. 2018 - Present",
      bullets: [
        "Communicate with managers to set up campus computers used on campus",
        "Assess and troubleshoot computer problems brought by students, faculty and staff",
        "Maintain upkeep of computers, classroom equipment, and 200 printers across campus"
      ]
    },
    {
      title: "Artificial Intelligence Research Assistant",
      location: "Georgetown, TX",
      organization: "Southwestern University",
      dates: "May 2019 - July 2019",
      bullets: [
        "Explored methods to generate video game dungeons based off of The Legend of Zelda",
        "Developed a game in Java to test the generated dungeons",
        "Contributed 50K+ lines of code to an established codebase via Git",
        "Conducted a human subject study to determine which video game dungeon generation technique is enjoyable",
        "Wrote an 8-page paper and gave multiple presentations on-campus",
        "Presented virtually to the World Conference on Computational Intelligence"
      ]
    }
  ]);
  
  // Projects state
  const [projects, setProjects] = useState<Project[]>([
    {
      name: "Gitlytics",
      tech: "Python, Flask, React, PostgreSQL, Docker",
      dates: "June 2020 - Present",
      bullets: [
        "Developed a full-stack web application using with Flask serving a REST API with React as the frontend",
        "Implemented GitHub OAuth to get data from user's repositories",
        "Visualized GitHub data to show collaboration",
        "Used Celery and Redis for asynchronous tasks"
      ]
    },
    {
      name: "Simple Paintball",
      tech: "Spigot API, Java, Maven, TravisCI, Git",
      dates: "May 2018 - May 2020",
      bullets: [
        "Developed a Minecraft server plugin to entertain kids during free time for a previous job",
        "Published plugin to websites gaining 2K+ downloads and an average 4.5/5-star review",
        "Implemented continuous delivery using TravisCI to build the plugin upon new a release",
        "Collaborated with Minecraft server administrators to suggest features and get feedback about the plugin"
      ]
    }
  ]);
  
  // Skills state
  const [skills, setSkills] = useState<Skills>({
    languages: "Java, Python, C/C++, SQL (Postgres), JavaScript, HTML/CSS, R",
    frameworks: "React, Node.js, Flask, JUnit, WordPress, Material-UI, FastAPI",
    tools: "Git, Docker, TravisCI, Google Cloud Platform, VS Code, Visual Studio, PyCharm, IntelliJ, Eclipse",
    libraries: "pandas, NumPy, Matplotlib"
  });

  // Helper functions to update nested state
  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setEducation(newEducation);
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExperience = [...experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setExperience(newExperience);
  };

  const updateExperienceBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const newExperience = [...experience];
    const newBullets = [...newExperience[expIndex].bullets];
    newBullets[bulletIndex] = value;
    newExperience[expIndex] = { ...newExperience[expIndex], bullets: newBullets };
    setExperience(newExperience);
  };

  const deleteExperienceBullet = (expIndex: number, bulletIndex: number) => {
    const newExperience = [...experience];
    const newBullets = newExperience[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    newExperience[expIndex] = { ...newExperience[expIndex], bullets: newBullets };
    setExperience(newExperience);
  };

  const addExperienceBullet = (expIndex: number) => {
    const newExperience = [...experience];
    const newBullets = [...newExperience[expIndex].bullets, "New bullet point"];
    newExperience[expIndex] = { ...newExperience[expIndex], bullets: newBullets };
    setExperience(newExperience);
  };

  const updateProject = (index: number, field: string, value: string) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setProjects(newProjects);
  };

  const updateProjectBullet = (projIndex: number, bulletIndex: number, value: string) => {
    const newProjects = [...projects];
    const newBullets = [...newProjects[projIndex].bullets];
    newBullets[bulletIndex] = value;
    newProjects[projIndex] = { ...newProjects[projIndex], bullets: newBullets };
    setProjects(newProjects);
  };

  const deleteProjectBullet = (projIndex: number, bulletIndex: number) => {
    const newProjects = [...projects];
    const newBullets = newProjects[projIndex].bullets.filter((_, i) => i !== bulletIndex);
    newProjects[projIndex] = { ...newProjects[projIndex], bullets: newBullets };
    setProjects(newProjects);
  };

  const addProjectBullet = (projIndex: number) => {
    const newProjects = [...projects];
    const newBullets = [...newProjects[projIndex].bullets, "New bullet point"];
    newProjects[projIndex] = { ...newProjects[projIndex], bullets: newBullets };
    setProjects(newProjects);
  };
  
  const updateContact = (field: string, value: string) => {
    setContact({...contact, [field]: value});
  };
  
  const updateSkills = (field: string, value: string) => {
    setSkills({...skills, [field]: value});
  };

  return (
    <div className={styles.resumePage}>
      <ResumeHeader 
        name={name} 
        contact={contact} 
        setName={setName} 
        updateContact={updateContact} 
      />
      
      <EducationSection 
        education={education} 
        updateEducation={updateEducation} 
      />
      
      <ExperienceSection 
        experience={experience}
        updateExperience={updateExperience}
        updateExperienceBullet={updateExperienceBullet}
        deleteExperienceBullet={deleteExperienceBullet}
        addExperienceBullet={addExperienceBullet}
      />
      
      <ProjectsSection
        projects={projects}
        updateProject={updateProject}
        updateProjectBullet={updateProjectBullet}
        deleteProjectBullet={deleteProjectBullet}
        addProjectBullet={addProjectBullet}
      />
      
      <SkillsSection 
        skills={skills} 
        updateSkills={updateSkills} 
      />
    </div>
  );
};

export default EditableResume;