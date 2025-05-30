import { resumeService, ResumeContent } from '@/app/services/resumeService';
import { VisibilityOptions } from './latexGenerator';

/**
 * Represents a bullet point in a resume section
 */
export interface Bullet {
  id: string;
  text: string;
}

/**
 * Base interface for all resume sections
 */
export interface Section {
  id: string;
  bullets: Bullet[];
}

/**
 * Education section with school details
 */
export interface EducationSection {
  id: string;
  school: string;
  degree: string;
  location: string;
  dates: string;
  category: string;
  skills: string;
}

/**
 * Work experience section with job details
 */
export interface ExperienceSection extends Section {
  title: string;
  organization: string;
  location: string;
  dates: string;
}

/**
 * Project section with project details
 */
export interface ProjectSection extends Section {
  name: string;
  tech: string;
  dates: string;
}

/**
 * Skill category with associated skills
 */
export interface Skill {
  id: string;
  category: string;
  skills: string;
}

/**
 * Contains all resume sections
 */
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

/**
 * Contact information for resume header
 */
export interface Contact {
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  github: string;
}

/**
 * Main application state
 */
export interface AppState {
  sections: Sections;
  name: string;
  contact: Contact;
  visibilityOptions?: VisibilityOptions;
}

/**
 * Types of actions for history tracking
 */
export enum HistoryActionType {
  ADD_SECTION = 'ADD_SECTION',
  DELETE_SECTION = 'DELETE_SECTION',
  ADD_BULLET = 'ADD_BULLET',
  DELETE_BULLET = 'DELETE_BULLET',
  UPDATE_SECTION = 'UPDATE_SECTION',
  UPDATE_BULLET = 'UPDATE_BULLET',
  UPDATE_NAME = 'UPDATE_NAME',
  UPDATE_CONTACT = 'UPDATE_CONTACT',
  UPDATE_SECTION_TITLE = 'UPDATE_SECTION_TITLE',
  ADD_SKILL_CATEGORY = 'ADD_SKILL_CATEGORY',
  UPDATE_SKILL = 'UPDATE_SKILL',
  BATCH_UPDATE = 'BATCH_UPDATE'
}

/**
 * Represents a single state change in history
 */
export interface HistoryEvent {
  type: HistoryActionType;
  beforeState: AppState;
  currentState: AppState;
  timestamp: number;
  description: string;
}

/**
 * Tracks the history of state changes
 */
export interface HistoryState {
  events: HistoryEvent[];
  currentIndex: number;
  currentState: AppState;
}

// Counter to help create unique IDs
export let idCounter = 0;

/**
 * Resets the ID counter to ensure fresh deterministic IDs
 */
export function resetIdCounter() {
  idCounter = 0;
}

/**
 * Generate a deterministic ID based on existing items
 * This replaces crypto.randomUUID() for server-side rendering compatibility
 */
function generateDeterministicId(prefix: string, items: any[], salt: string = ''): string {
  // Use a counter instead of timestamp to ensure deterministic IDs
  idCounter += 1;
  const itemCount = items.length;
  // Create a predictable but unique ID
  return `${prefix}-${itemCount}-${idCounter}-${salt}`;
}

/**
 * Creates a history event with before and after states
 */
export const createHistoryEvent = (
  type: HistoryActionType,
  beforeState: AppState,
  currentState: AppState,
  description: string
): HistoryEvent => ({
  type,
  beforeState,
  currentState,
  timestamp: Date.now(),
  description
});

/**
 * Adds an event to history
 */
export const updateHistory = (
  actionType: HistoryActionType,
  beforeState: AppState,
  newState: AppState,
  description: string,
  setHistory: Function
) => {
  if (JSON.stringify(beforeState) === JSON.stringify(newState)) {
    console.warn("Attempted to add identical state to history. Skipping.");
    return;
  }

  setHistory((prev: HistoryState) => {
    const newEvent = createHistoryEvent(actionType, beforeState, newState, description);
    const newEvents = prev.events.slice(0, prev.currentIndex + 1);
    
    return {
      events: [...newEvents, newEvent],
      currentIndex: newEvents.length,
      currentState: newState
    };
  });
};

/**
 * Reverts to previous state in history
 */
export const undo = (setHistory: Function) => {
  setHistory((prev: HistoryState) => {
    if (prev.currentIndex <= 0) return prev;
    
    const newIndex = prev.currentIndex - 1;
    const previousEvent = prev.events[newIndex];
    
    return {
      ...prev,
      currentIndex: newIndex,
      currentState: previousEvent.beforeState
    };
  });
};

/**
 * Advances to next state in history
 */
export const redo = (setHistory: Function) => {
  setHistory((prev: HistoryState) => {
    if (prev.currentIndex >= prev.events.length - 1) return prev;
    
    const newIndex = prev.currentIndex + 1;
    const nextEvent = prev.events[newIndex];
    
    return {
      ...prev,
      currentIndex: newIndex,
      currentState: nextEvent.currentState
    };
  });
};

/**
 * Creates a debounce utility
 */
export const createDebouncer = () => {
  const timers: Record<string, number> = {};
  
  return (
    key: string, 
    fn: Function, 
    delay: number = 500
  ) => {
    if (timers[key]) {
      clearTimeout(timers[key]);
    }
    
    timers[key] = window.setTimeout(() => {
      fn();
      delete timers[key];
    }, delay);
  };
};

const debounce = createDebouncer();

// Define section types
type SectionType = 'education' | 'experience' | 'projects' | 'skills';
type ContentSectionType = 'education' | 'experience' | 'projects';

/**
 * Removes a section from the resume
 */
export const deleteSection = (
  currentState: AppState,
  sectionType: SectionType,
  id: string,
  setHistory: Function
) => {
  try {
    console.log(`Attempting to delete section of type ${sectionType} with ID: ${id}`);
    
    // Check if section type exists in current state
    if (!currentState.sections || !currentState.sections[sectionType]) {
      console.error(`Section type ${sectionType} not found in current state`);
      return;
    }
    
    // Check if section with ID exists
    const sectionExists = currentState.sections[sectionType].some(item => item.id === id);
    if (!sectionExists) {
      console.error(`Section with ID ${id} not found in ${sectionType}`);
      return;
    }
    
    const beforeState = { ...currentState };
    
    // Create new sections with the item filtered out
    const newSections = {
      ...currentState.sections,
      [sectionType]: currentState.sections[sectionType].filter((item) => item.id !== id),
    };
    
    console.log(`Removed section with ID ${id} from ${sectionType}. Section count before: ${currentState.sections[sectionType].length}, after: ${newSections[sectionType].length}`);
    
    const afterState = { ...currentState, sections: newSections };
    
    // Immediately update the history state to ensure the UI updates
    setHistory((prev: HistoryState) => ({
      ...prev,
      currentState: afterState
    }));
    
    // Then add the event to history
    updateHistory(
      HistoryActionType.DELETE_SECTION,
      beforeState,
      afterState,
      `Deleted ${sectionType} section`,
      setHistory
    );
  } catch (error) {
    console.error('Error in deleteSection:', error);
  }
};

/**
 * Removes a bullet point from a section
 */
export const deleteBullet = (
  currentState: AppState,
  sectionType: ContentSectionType,
  sectionId: string,
  bulletId: string,
  setHistory: Function
) => {
  if (sectionType === 'education') return; // Education no longer has bullets
  
  const beforeState = { ...currentState };
  
  const newSections = {
    ...currentState.sections,
    [sectionType]: currentState.sections[sectionType].map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          bullets: section.bullets.filter((bullet) => bullet.id !== bulletId),
        };
      }
      return section;
    }),
  };
  
  const afterState = { ...currentState, sections: newSections };
  
  updateHistory(
    HistoryActionType.DELETE_BULLET,
    beforeState,
    afterState,
    `Deleted bullet from ${sectionType}`,
    setHistory
  );
};

/**
 * Adds a new bullet point to a section
 */
export const addBullet = (
  currentState: AppState,
  sectionType: ContentSectionType,
  sectionId: string,
  setHistory: Function
) => {
  try {
    const beforeState = { ...currentState };
    
    const sectionIndex = currentState.sections[sectionType].findIndex(section => section.id === sectionId);
    
    if (sectionIndex === -1) {
      console.error(`Section not found with ID: ${sectionId}`);
      return;
    }
    
    const section = currentState.sections[sectionType][sectionIndex];
    const newBullets = [...section.bullets];
    
    newBullets.push({
      id: generateDeterministicId('bullet', section.bullets, sectionId),
      text: ''
    });
    
    const newSections = {
      ...currentState.sections,
      [sectionType]: currentState.sections[sectionType].map((section, index) => {
        if (index === sectionIndex) {
          return {
            ...section,
            bullets: newBullets
          };
        }
        return section;
      })
    };
    
    const afterState = { ...currentState, sections: newSections };
    
    updateHistory(
      HistoryActionType.ADD_BULLET,
      beforeState,
      afterState,
      'Added bullet point',
      setHistory
    );
  } catch (error) {
    console.error('[addBullet] Error adding bullet:', error);
  }
};

/**
 * Adds a new skill category
 */
export const addSkillCategory = (currentState: AppState, setHistory: Function) => {
  const beforeState = { ...currentState };
  
  const newSections = {
    ...currentState.sections,
    skills: [...currentState.sections.skills, { 
      id: generateDeterministicId('skill', currentState.sections.skills), 
      category: '', 
      skills: '' 
    }],
  };
  
  const afterState = { ...currentState, sections: newSections };
  
  updateHistory(
    HistoryActionType.ADD_SKILL_CATEGORY,
    beforeState,
    afterState,
    'Added skill category',
    setHistory
  );
};

/**
 * Adds a new section to the resume
 */
export const addSection = (
  currentState: AppState,
  sectionType: ContentSectionType,
  setHistory: Function
) => {
  const beforeState = { ...currentState };
  
  let newSpecificSection;

  if (sectionType === 'projects') {
    const sectionId = generateDeterministicId('project', currentState.sections.projects);
    newSpecificSection = {
      id: sectionId,
      name: '',
      tech: '',
      dates: '',
      bullets: [
        { id: generateDeterministicId('bullet', [], `${sectionId}-1`), text: '' },
        { id: generateDeterministicId('bullet', [], `${sectionId}-2`), text: '' },
        { id: generateDeterministicId('bullet', [], `${sectionId}-3`), text: '' },
      ],
    };
  } else if (sectionType === 'experience') {
    const sectionId = generateDeterministicId('exp', currentState.sections.experience);
    newSpecificSection = {
      id: sectionId,
      title: '',
      organization: '',
      location: '',
      dates: '',
      bullets: [
        { id: generateDeterministicId('bullet', [], `${sectionId}-1`), text: '' },
        { id: generateDeterministicId('bullet', [], `${sectionId}-2`), text: '' },
        { id: generateDeterministicId('bullet', [], `${sectionId}-3`), text: '' },
      ],
    };
  } else {
    newSpecificSection = {
      id: generateDeterministicId('edu', currentState.sections.education),
      school: '',
      degree: '',
      location: '',
      dates: '',
      category: '',
      skills: '',
    };
  }

  const newSections = {
    ...currentState.sections,
    [sectionType]: [...currentState.sections[sectionType], newSpecificSection],
  };
  
  const afterState = { ...currentState, sections: newSections };
  
  updateHistory(
    HistoryActionType.ADD_SECTION,
    beforeState,
    afterState,
    `Added ${sectionType} section`,
    setHistory
  );
};

/**
 * Generic function to update a section field
 */
export const updateSectionField = (
  currentState: AppState,
  sectionType: ContentSectionType,
  index: number,
  field: string,
  value: string,
  setHistory: Function
) => {
  const debounceKey = `${sectionType}_${index}_${field}`;
  const beforeState = { ...currentState };
  
  const newSections = {
    ...currentState.sections,
    [sectionType]: currentState.sections[sectionType].map((section, i) => {
      if (i === index) {
        return { ...section, [field]: value };
      }
      return section;
    }),
  };
  
  const afterState = { ...currentState, sections: newSections };
  
  debounce(debounceKey, () => {
    updateHistory(
      HistoryActionType.UPDATE_SECTION,
      beforeState,
      afterState,
      `Updated ${sectionType} ${field}`,
      setHistory
    );
  });
  
  setHistory((prev: HistoryState) => ({
    ...prev,
    currentState: afterState
  }));
};

/**
 * Generic function to update a bullet point
 */
export const updateSectionBullet = (
  currentState: AppState,
  sectionType: ContentSectionType,
  sectionIndex: number,
  bulletIndex: number,
  value: string,
  setHistory: Function
) => {
  if (sectionType === 'education') return; // Education no longer has bullets
  
  const sectionArray = currentState.sections[sectionType];
  const sectionId = sectionArray[sectionIndex]?.id;
  const bulletId = sectionArray[sectionIndex]?.bullets[bulletIndex]?.id;

  if (!sectionId || !bulletId) return;
  
  const debounceKey = `${sectionType}_bullet_${sectionId}_${bulletId}`;
  const beforeState = { ...currentState };

  const newSections = {
    ...currentState.sections,
    [sectionType]: currentState.sections[sectionType].map((section, i) => {
      if (i === sectionIndex) {
        return {
          ...section,
          bullets: section.bullets.map((b, j) => (j === bulletIndex ? { ...b, text: value } : b)),
        };
      }
      return section;
    }),
  };
  
  const afterState = { ...currentState, sections: newSections };
  
  debounce(debounceKey, () => {
    updateHistory(
      HistoryActionType.UPDATE_BULLET,
      beforeState,
      afterState,
      `Updated ${sectionType} bullet`,
      setHistory
    );
  });
  
  setHistory((prev: HistoryState) => ({
    ...prev,
    currentState: afterState
  }));
};

/**
 * Updates an education section field
 */
export const updateEducation = (
  currentState: AppState,
  index: number,
  field: keyof EducationSection,
  value: string,
  setHistory: Function
) => {
  updateSectionField(currentState, 'education', index, field, value, setHistory);
};

/**
 * Updates an education bullet point
 */
export const updateEducationBullet = (
  currentState: AppState,
  eduIndex: number,
  bulletIndex: number,
  value: string,
  setHistory: Function
) => {
  updateSectionBullet(currentState, 'education', eduIndex, bulletIndex, value, setHistory);
};

/**
 * Updates an experience section field
 */
export const updateExperience = (
  currentState: AppState,
  index: number,
  field: keyof ExperienceSection,
  value: string,
  setHistory: Function
) => {
  updateSectionField(currentState, 'experience', index, field, value, setHistory);
};

/**
 * Updates an experience bullet point
 */
export const updateExperienceBullet = (
  currentState: AppState,
  expIndex: number,
  bulletIndex: number,
  value: string,
  setHistory: Function
) => {
  updateSectionBullet(currentState, 'experience', expIndex, bulletIndex, value, setHistory);
};

/**
 * Updates a project section field
 */
export const updateProject = (
  currentState: AppState,
  index: number,
  field: keyof ProjectSection,
  value: string,
  setHistory: Function
) => {
  updateSectionField(currentState, 'projects', index, field, value, setHistory);
};

/**
 * Updates a project bullet point
 */
export const updateProjectBullet = (
  currentState: AppState,
  projIndex: number,
  bulletIndex: number,
  value: string,
  setHistory: Function
) => {
  updateSectionBullet(currentState, 'projects', projIndex, bulletIndex, value, setHistory);
};

/**
 * Updates a skill field
 */
export const updateSkill = (
  currentState: AppState,
  index: number,
  field: keyof Skill,
  value: string,
  setHistory: Function
) => {
  const debounceKey = `skill_${index}_${field}`;
  const beforeState = { ...currentState };
  
  const newSections = {
    ...currentState.sections,
    skills: currentState.sections.skills.map((skill, i) => {
      if (i === index) {
        return { ...skill, [field]: value };
      }
      return skill;
    }),
  };
  
  const afterState = { ...currentState, sections: newSections };
  
  debounce(debounceKey, () => {
    updateHistory(
      HistoryActionType.UPDATE_SKILL,
      beforeState,
      afterState,
      `Updated skill ${field}`,
      setHistory
    );
  });
  
  setHistory((prev: HistoryState) => ({
    ...prev,
    currentState: afterState
  }));
};

/**
 * Updates a section title
 */
export const updateSectionTitle = (
  currentState: AppState,
  sectionType: 'additionalTitle' | 'educationTitle' | 'experienceTitle' | 'projectsTitle',
  value: string,
  setHistory: Function
) => {
  const debounceKey = `section_title_${sectionType}`;
  const beforeState = { ...currentState };
  
  const newSections = {
    ...currentState.sections,
    [sectionType]: value,
  };
  
  const afterState = { ...currentState, sections: newSections };
  
  debounce(debounceKey, () => {
    updateHistory(
      HistoryActionType.UPDATE_SECTION_TITLE,
      beforeState,
      afterState,
      `Updated ${sectionType}`,
      setHistory
    );
  });
  
  setHistory((prev: HistoryState) => ({
    ...prev,
    currentState: afterState
  }));
};

/**
 * Updates the name field
 */
export const updateName = (
  currentState: AppState,
  newName: string,
  setHistory: Function
) => {
  if (currentState.name === newName) return;
  
  const debounceKey = 'name';
  const beforeState = { ...currentState };
  const afterState = { ...currentState, name: newName };
  
  debounce(debounceKey, () => {
    updateHistory(
      HistoryActionType.UPDATE_NAME,
      beforeState,
      afterState,
      'Updated name',
      setHistory
    );
  });
  
  setHistory((prev: HistoryState) => ({
    ...prev,
    currentState: afterState
  }));
};

/**
 * Updates a contact field
 */
export const updateContactField = (
  currentState: AppState,
  field: keyof Contact,
  value: string,
  setHistory: Function
) => {
  if (currentState.contact[field] === value) return;
  
  const debounceKey = `contact_${field}`;
  const beforeState = { ...currentState };
  
  const newContact = { ...currentState.contact, [field]: value };
  const afterState = { ...currentState, contact: newContact };
  
  debounce(debounceKey, () => {
    updateHistory(
      HistoryActionType.UPDATE_CONTACT,
      beforeState,
      afterState,
      `Updated contact ${field}`,
      setHistory
    );
  });
  
  setHistory((prev: HistoryState) => ({
    ...prev,
    currentState: afterState
  }));
};

/**
 * Creates initial history state with default sections
 */
export const getInitialHistoryState = (): HistoryState => {
  const initialState: AppState = {
    sections: {
      education: [{
        id: 'initial-edu-1',
        school: '', degree: '', location: '', dates: '',
        category: '', skills: ''
      }],
      experience: [{
        id: 'initial-exp-1',
        title: '', organization: '', location: '', dates: '',
        bullets: [
          { id: 'initial-exp-1-bullet-1', text: '' },
          { id: 'initial-exp-1-bullet-2', text: '' },
          { id: 'initial-exp-1-bullet-3', text: '' }
        ]
      }],
      projects: [{
        id: 'initial-proj-1',
        name: '', tech: '', dates: '',
        bullets: [
          { id: 'initial-proj-1-bullet-1', text: '' },
          { id: 'initial-proj-1-bullet-2', text: '' },
          { id: 'initial-proj-1-bullet-3', text: '' }
        ]
      }],
      skills: [
        { id: 'initial-skill-1', category: '', skills: '' },
        { id: 'initial-skill-2', category: '', skills: '' },
        { id: 'initial-skill-3', category: '', skills: '' }
      ],
      additionalTitle: 'Additional',
      educationTitle: 'Education',
      experienceTitle: 'Experience',
      projectsTitle: 'Projects'
    },
    name: '',
    contact: {
      phone: '', email: '', website: '', linkedin: '', github: ''
    }
  };

  const initialEvent: HistoryEvent = {
    type: HistoryActionType.BATCH_UPDATE,
    beforeState: initialState,
    currentState: initialState,
    timestamp: Date.now(),
    description: 'Initial state'
  };

  return {
    events: [initialEvent],
    currentIndex: 0,
    currentState: initialState
  };
};

/**
 * Saves current state to localStorage
 */
export const saveToLocalStorage = (historyState: HistoryState) => {
  try {
    // Get existing data to preserve resumeId if it exists
    let resumeId = null;
    try {
      const existingData = localStorage.getItem('resumeEditorData');
      if (existingData) {
        const parsed = JSON.parse(existingData);
        if (parsed.resumeId) {
          resumeId = parsed.resumeId;
        }
      }
    } catch (e) {
      console.error('Error reading existing localStorage data:', e);
    }
    
    const dataToSave = {
      currentState: historyState.currentState,
      savedAt: new Date().toISOString(),
      resumeId: resumeId // Preserve the resumeId if it exists
    };
    localStorage.setItem('resumeEditorData', JSON.stringify(dataToSave));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
};

/**
 * Loads state from localStorage
 */
export const loadFromLocalStorage = (): AppState | null => {
  try {
    const savedData = localStorage.getItem('resumeEditorData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.currentState && 
          parsed.currentState.sections && 
          parsed.currentState.name !== undefined && 
          parsed.currentState.contact) {
        return parsed.currentState;
      }
    }
  } catch (err) {
    console.error('Error loading from localStorage:', err);
  }

  return null;
};

/**
 * Clears saved state from localStorage
 */
export const clearLocalStorage = () => {
  try {
    localStorage.removeItem('resumeEditorData');
    console.log('Cleared localStorage');
  } catch (err) {
    console.error('Error clearing localStorage:', err);
  }
};

/**
 * Returns statistics about history state
 */
export const getHistoryStats = (historyState: HistoryState) => {
  return {
    totalEvents: historyState.events.length,
    currentPosition: historyState.currentIndex + 1,
    canUndo: historyState.currentIndex > 0,
    canRedo: historyState.currentIndex < historyState.events.length - 1,
    lastEvent: historyState.events[historyState.currentIndex]?.description || 'None'
  };
};

/**
 * Returns recent history actions for UI display
 */
export const getRecentActions = (historyState: HistoryState, count: number = 5) => {
  const startIdx = Math.max(0, historyState.currentIndex - count);
  const endIdx = historyState.currentIndex;
  
  return historyState.events
    .slice(startIdx, endIdx + 1)  
    .map(event => ({
      description: event.description,
      timestamp: new Date(event.timestamp).toLocaleTimeString(),
      isCurrent: historyState.events.indexOf(event) === historyState.currentIndex
    }))
    .reverse();
};

/**
 * Sanitizes a string to be used as a Firebase document ID
 */
const sanitizeId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')  // Replace non-alphanumeric with hyphens
    .replace(/-+/g, '-')         // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '');      // Remove leading/trailing hyphens
};

/**
 * Saves the current resume state to Firebase
 */
export const saveResume = async (
  currentState: AppState,
  resumeId: string | null = null,
  resumeTitle: string = 'Untitled Resume'
): Promise<string> => {
  try {
    // Convert AppState to ResumeContent format
    const resumeContent: ResumeContent = {
      personalInfo: {
        name: currentState.name,
        email: currentState.contact.email,
        phone: currentState.contact.phone,
        website: currentState.contact.website,
        linkedin: currentState.contact.linkedin,
        github: currentState.contact.github,
      },
      education: currentState.sections.education.map(edu => ({
        id: edu.id,
        school: edu.school,
        degree: edu.degree,
        location: edu.location,
        date: edu.dates,
        category: edu.category,
        skills: edu.skills,
      })),
      experience: currentState.sections.experience.map(exp => ({
        id: exp.id,
        company: exp.organization,
        title: exp.title,
        location: exp.location,
        startDate: exp.dates.split(' - ')[0],
        endDate: exp.dates.split(' - ')[1] || exp.dates,
        bullets: exp.bullets.map(bullet => ({
          id: bullet.id,
          text: bullet.text,
        })),
      })),
      projects: currentState.sections.projects.map(proj => ({
        id: proj.id,
        name: proj.name,
        tech: proj.tech,
        dates: proj.dates,
        bullets: proj.bullets.map(bullet => ({
          id: bullet.id,
          text: bullet.text,
        })),
      })),
      skills: currentState.sections.skills.map(skill => ({
        id: skill.id,
        category: skill.category,
        skills: skill.skills,
      })),
      sectionTitles: {
        educationTitle: currentState.sections.educationTitle,
        experienceTitle: currentState.sections.experienceTitle,
        projectsTitle: currentState.sections.projectsTitle,
        additionalTitle: currentState.sections.additionalTitle,
      },
    };
    
    // Use resumeService to save to Firebase with the provided title
    const savedResumeId = await resumeService.saveResume(
      resumeId,
      resumeTitle,  // Use the provided title parameter
      resumeContent
    );

    return savedResumeId;
  } catch (error) {
    console.error('Error saving resume:', error);
    throw error;
  }
};