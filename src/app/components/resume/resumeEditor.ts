// Define all the interfaces
export interface Bullet {
  id: string;
  text: string;
}

export interface Section {
  id: string;
  bullets: Bullet[];
}

export interface EducationSection extends Section {
  school: string;
  degree: string;
  location: string;
  dates: string;
}

export interface ExperienceSection extends Section {
  title: string;
  organization: string;
  location: string;
  dates: string;
}

export interface ProjectSection extends Section {
  name: string;
  tech: string;
  dates: string;
}

export interface Skill {
  id: string;
  category: string;
  skills: string;
}

export interface Sections {
  education: EducationSection[];
  experience: ExperienceSection[];
  projects: ProjectSection[];
  skills: Skill[];
  additionalTitle: string;
  educationTitle: string;
  experienceTitle: string;
  projectsTitle: string;
}

export interface HistoryState {
  past: Sections[];
  present: Sections;
  future: Sections[];
}

export interface Contact {
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  github: string;
}

// History operations
export const updateHistory = (sections: Sections, setHistory: Function) => {
  setHistory((prev: HistoryState) => ({
    past: [...prev.past, prev.present],
    present: sections,
    future: []
  }));
};

export const undo = (setHistory: Function) => {
  setHistory((prev: HistoryState) => {
    if (prev.past.length === 0) return prev;
    
    const previous = prev.past[prev.past.length - 1];
    const newPast = prev.past.slice(0, prev.past.length - 1);
    
    return {
      past: newPast,
      present: previous,
      future: [prev.present, ...prev.future]
    };
  });
};

export const redo = (setHistory: Function) => {
  setHistory((prev: HistoryState) => {
    if (prev.future.length === 0) return prev;
    
    const next = prev.future[0];
    const newFuture = prev.future.slice(1);
    
    return {
      past: [...prev.past, prev.present],
      present: next,
      future: newFuture
    };
  });
};

// Section operations
export const deleteSection = (
  sections: Sections, 
  sectionType: 'education' | 'experience' | 'projects' | 'skills', 
  id: string, 
  setHistory: Function
) => {
  const newSections = {
    ...sections,
    [sectionType]: sections[sectionType].filter(item => item.id !== id)
  };
  updateHistory(newSections, setHistory);
};

export const deleteBullet = (
  sections: Sections,
  sectionType: 'education' | 'experience' | 'projects', 
  sectionId: string, 
  bulletId: string,
  setHistory: Function
) => {
  const newSections = {
    ...sections,
    [sectionType]: sections[sectionType].map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          bullets: section.bullets.filter(bullet => bullet.id !== bulletId)
        };
      }
      return section;
    })
  };
  updateHistory(newSections, setHistory);
};

export const addBullet = (
  sections: Sections,
  sectionType: 'education' | 'experience' | 'projects', 
  sectionId: string,
  setHistory: Function
) => {
  const newSections = {
    ...sections,
    [sectionType]: sections[sectionType].map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          bullets: [...section.bullets, { id: crypto.randomUUID(), text: '' }]
        };
      }
      return section;
    })
  };
  updateHistory(newSections, setHistory);
};

export const addSkillCategory = (sections: Sections, setHistory: Function) => {
  const newSections = {
    ...sections,
    skills: [...sections.skills, { id: crypto.randomUUID(), category: '', skills: '' }]
  };
  updateHistory(newSections, setHistory);
};

export const addSection = (
  sections: Sections,
  sectionType: 'education' | 'experience' | 'projects',
  setHistory: Function
) => {
  let newSection;
  
  if (sectionType === 'projects') {
    newSection = {
      id: crypto.randomUUID(),
      name: '',
      tech: '',
      dates: '',
      bullets: [
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' }
      ]
    };
  } else if (sectionType === 'experience') {
    newSection = {
      id: crypto.randomUUID(),
      title: '',
      organization: '',
      location: '',
      dates: '',
      bullets: [
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' }
      ]
    };
  } else {
    newSection = {
      id: crypto.randomUUID(),
      school: '',
      degree: '',
      location: '',
      dates: '',
      bullets: [
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' }
      ]
    };
  }
  
  const newSections = {
    ...sections,
    [sectionType]: [...sections[sectionType], newSection]
  };
  updateHistory(newSections, setHistory);
};

// Field updates
export const updateEducation = (
  sections: Sections,
  index: number, 
  field: string, 
  value: string,
  setHistory: Function
) => {
  const newSections = {
    ...sections,
    education: sections.education.map((edu, i) => {
      if (i === index) {
        return {
          ...edu,
          [field]: value
        };
      }
      return edu;
    })
  };
  updateHistory(newSections, setHistory);
};

export const updateEducationBullet = (
  sections: Sections,
  eduIndex: number, 
  bulletIndex: number, 
  value: string,
  setHistory: Function
) => {
  const eduId = sections.education[eduIndex]?.id;
  const bulletId = sections.education[eduIndex]?.bullets[bulletIndex]?.id;
  
  if (eduId && bulletId) {
    const newSections = {
      ...sections,
      education: sections.education.map(section => {
        if (section.id === eduId) {
          return {
            ...section,
            bullets: section.bullets.map(b => {
              if (b.id === bulletId) {
                return { ...b, text: value };
              }
              return b;
            })
          };
        }
        return section;
      })
    };
    updateHistory(newSections, setHistory);
  }
};

export const updateExperience = (
  sections: Sections,
  index: number, 
  field: string, 
  value: string,
  setHistory: Function
) => {
  const newSections = {
    ...sections,
    experience: sections.experience.map((exp, i) => {
      if (i === index) {
        return {
          ...exp,
          [field]: value
        };
      }
      return exp;
    })
  };
  updateHistory(newSections, setHistory);
};

export const updateExperienceBullet = (
  sections: Sections,
  expIndex: number, 
  bulletIndex: number, 
  value: string,
  setHistory: Function
) => {
  const expId = sections.experience[expIndex]?.id;
  const bulletId = sections.experience[expIndex]?.bullets[bulletIndex]?.id;
  
  if (expId && bulletId) {
    const newSections = {
      ...sections,
      experience: sections.experience.map(section => {
        if (section.id === expId) {
          return {
            ...section,
            bullets: section.bullets.map(b => {
              if (b.id === bulletId) {
                return { ...b, text: value };
              }
              return b;
            })
          };
        }
        return section;
      })
    };
    updateHistory(newSections, setHistory);
  }
};

export const updateProject = (
  sections: Sections,
  index: number, 
  field: string, 
  value: string,
  setHistory: Function
) => {
  const newSections = {
    ...sections,
    projects: sections.projects.map((project, i) => {
      if (i === index) {
        return {
          ...project,
          [field]: value
        };
      }
      return project;
    })
  };
  updateHistory(newSections, setHistory);
};

export const updateProjectBullet = (
  sections: Sections,
  projIndex: number, 
  bulletIndex: number, 
  value: string,
  setHistory: Function
) => {
  const projectId = sections.projects[projIndex]?.id;
  const bulletId = sections.projects[projIndex]?.bullets[bulletIndex]?.id;
  
  if (projectId && bulletId) {
    const newSections = {
      ...sections,
      projects: sections.projects.map(section => {
        if (section.id === projectId) {
          return {
            ...section,
            bullets: section.bullets.map(b => {
              if (b.id === bulletId) {
                return { ...b, text: value };
              }
              return b;
            })
          };
        }
        return section;
      })
    };
    updateHistory(newSections, setHistory);
  }
};

export const updateSkill = (
  sections: Sections,
  index: number, 
  field: string, 
  value: string,
  setHistory: Function
) => {
  const newSections = {
    ...sections,
    skills: sections.skills.map((skill, i) => {
      if (i === index) {
        return { ...skill, [field]: value };
      }
      return skill;
    })
  };
  updateHistory(newSections, setHistory);
};

export const updateSectionTitle = (
  sections: Sections,
  sectionType: 'additionalTitle' | 'educationTitle' | 'experienceTitle' | 'projectsTitle',
  value: string,
  setHistory: Function
) => {
  const newSections = {
    ...sections,
    [sectionType]: value
  };
  updateHistory(newSections, setHistory);
};

// Initial state for the resume editor
export const getInitialHistoryState = (): HistoryState => ({
  past: [],
  present: {
    education: [{ 
      id: '1',
      school: '',
      degree: '',
      location: '',
      dates: '',
      bullets: [
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' }
      ]
    }],
    experience: [{ 
      id: '1',
      title: '',
      organization: '',
      location: '',
      dates: '',
      bullets: [
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' }
      ]
    }],
    projects: [{ 
      id: '1',
      name: '',
      tech: '',
      dates: '',
      bullets: [
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' }
      ]
    }],
    skills: [
      { id: crypto.randomUUID(), category: '', skills: '' },
      { id: crypto.randomUUID(), category: '', skills: '' },
      { id: crypto.randomUUID(), category: '', skills: '' }
    ],
    additionalTitle: 'Additional',
    educationTitle: 'Education',
    experienceTitle: 'Experience',
    projectsTitle: 'Projects'
  },
  future: []
}); 