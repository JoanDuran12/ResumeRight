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

export interface Contact {
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  github: string;
}

// Include name and contact in the state managed by history
export interface AppState {
  sections: Sections;
  name: string;
  contact: Contact;
}

// ***** MODIFIED *****
// Define event types for history tracking
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

// ***** MODIFIED *****
// Define history event interface
export interface HistoryEvent {
  type: HistoryActionType;
  beforeState: AppState;
  currentState: AppState;
  timestamp: number;
  description: string;
}

// ***** MODIFIED *****
// HistoryState now tracks events rather than just states
export interface HistoryState {
  events: HistoryEvent[];
  currentIndex: number; // Index pointing to the current state in the events array
  currentState: AppState; // Current state for easy access
}

// ***** MODIFIED *****
// Create a history event with before and after states
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

// ***** MODIFIED *****
// History operations now work with events
export const updateHistory = (
  actionType: HistoryActionType,
  beforeState: AppState,
  newState: AppState,
  description: string,
  setHistory: Function
) => {
  // Prevent adding identical state to history
  if (JSON.stringify(beforeState) === JSON.stringify(newState)) {
    console.warn("Attempted to add identical state to history. Skipping.");
    return;
  }

  setHistory((prev: HistoryState) => {
    // Create new event
    const newEvent = createHistoryEvent(actionType, beforeState, newState, description);
    
    // If we're in the middle of the history (user has undone), remove future events
    const newEvents = prev.events.slice(0, prev.currentIndex + 1);
    
    return {
      events: [...newEvents, newEvent],
      currentIndex: newEvents.length,
      currentState: newState
    };
  });
};

// ***** MODIFIED *****
export const undo = (setHistory: Function) => {
  setHistory((prev: HistoryState) => {
    if (prev.currentIndex <= 0) return prev; // Can't undo if at the beginning
    
    const newIndex = prev.currentIndex - 1;
    const previousEvent = prev.events[newIndex];
    
    return {
      ...prev,
      currentIndex: newIndex,
      currentState: previousEvent.beforeState // Go to the before state of the previous event
    };
  });
};

// ***** MODIFIED *****
export const redo = (setHistory: Function) => {
  setHistory((prev: HistoryState) => {
    if (prev.currentIndex >= prev.events.length - 1) return prev; // Can't redo if at the end
    
    const newIndex = prev.currentIndex + 1;
    const nextEvent = prev.events[newIndex];
    
    return {
      ...prev,
      currentIndex: newIndex,
      currentState: nextEvent.currentState // Go to the after state of the next event
    };
  });
};

// ***** MODIFIED *****
// Section/Field operations now use the event-based history system
export const deleteSection = (
  currentState: AppState,
  sectionType: 'education' | 'experience' | 'projects' | 'skills',
  id: string,
  setHistory: Function
) => {
  const beforeState = { ...currentState };
  
  const newSections = {
    ...currentState.sections,
    [sectionType]: currentState.sections[sectionType].filter((item) => item.id !== id),
  };
  
  const afterState = { ...currentState, sections: newSections };
  
  updateHistory(
    HistoryActionType.DELETE_SECTION,
    beforeState,
    afterState,
    `Deleted ${sectionType} section`,
    setHistory
  );
};

export const deleteBullet = (
  currentState: AppState,
  sectionType: 'education' | 'experience' | 'projects',
  sectionId: string,
  bulletId: string,
  setHistory: Function
) => {
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

export const addBullet = (
  currentState: AppState,
  sectionType: 'education' | 'experience' | 'projects',
  sectionId: string,
  setHistory: Function
) => {
  const beforeState = { ...currentState };
  
  const newSections = {
    ...currentState.sections,
    [sectionType]: currentState.sections[sectionType].map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          bullets: [...section.bullets, { id: crypto.randomUUID(), text: '' }],
        };
      }
      return section;
    }),
  };
  
  const afterState = { ...currentState, sections: newSections };
  
  updateHistory(
    HistoryActionType.ADD_BULLET,
    beforeState,
    afterState,
    `Added bullet to ${sectionType}`,
    setHistory
  );
};

export const addSkillCategory = (currentState: AppState, setHistory: Function) => {
  const beforeState = { ...currentState };
  
  const newSections = {
    ...currentState.sections,
    skills: [...currentState.sections.skills, { id: crypto.randomUUID(), category: '', skills: '' }],
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

export const addSection = (
  currentState: AppState,
  sectionType: 'education' | 'experience' | 'projects',
  setHistory: Function
) => {
  const beforeState = { ...currentState };
  
  let newSpecificSection;

  if (sectionType === 'projects') {
    newSpecificSection = {
      id: crypto.randomUUID(),
      name: '',
      tech: '',
      dates: '',
      bullets: [
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' },
      ],
    };
  } else if (sectionType === 'experience') {
    newSpecificSection = {
      id: crypto.randomUUID(),
      title: '',
      organization: '',
      location: '',
      dates: '',
      bullets: [
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' },
        { id: crypto.randomUUID(), text: '' },
      ],
    };
  } else {
    newSpecificSection = {
      id: crypto.randomUUID(),
      school: '',
      degree: '',
      location: '',
      dates: '',
      bullets: [{ id: crypto.randomUUID(), text: '' }],
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

// ***** MODIFIED *****
// We use a debounced update for text fields to avoid recording every keystroke
// This implementation requires a debounce utility to be defined elsewhere
// Let's create a simple one
export const createDebouncer = () => {
  const timers: Record<string, number> = {};
  
  return (
    key: string, 
    fn: Function, 
    delay: number = 500
  ) => {
    // Clear previous timer
    if (timers[key]) {
      clearTimeout(timers[key]);
    }
    
    // Set new timer
    timers[key] = window.setTimeout(() => {
      fn();
      delete timers[key];
    }, delay);
  };
};

// Initialize debouncer
const debounce = createDebouncer();

// Field updates with debounce for text input
export const updateEducation = (
  currentState: AppState,
  index: number,
  field: keyof EducationSection,
  value: string,
  setHistory: Function
) => {
  // Create a unique key for this field update
  const debounceKey = `education_${index}_${field}`;
  
  // Get current (pre-update) state for history
  const beforeState = { ...currentState };
  
  // Create updated state
  const newSections = {
    ...currentState.sections,
    education: currentState.sections.education.map((edu, i) => {
      if (i === index) {
        return {
          ...edu,
          [field]: value,
        };
      }
      return edu;
    }),
  };
  
  const afterState = { ...currentState, sections: newSections };
  
  // Debounce the history update to avoid recording every keystroke
  debounce(debounceKey, () => {
    updateHistory(
      HistoryActionType.UPDATE_SECTION,
      beforeState,
      afterState,
      `Updated education ${field}`,
      setHistory
    );
  });
  
  // Still update the state immediately, but don't record in history yet
  setHistory((prev: HistoryState) => ({
    ...prev,
    currentState: afterState
  }));
};

export const updateEducationBullet = (
  currentState: AppState,
  eduIndex: number,
  bulletIndex: number,
  value: string,
  setHistory: Function
) => {
  const eduId = currentState.sections.education[eduIndex]?.id;
  const bulletId = currentState.sections.education[eduIndex]?.bullets[bulletIndex]?.id;

  if (!eduId || !bulletId) return;
  
  // Create a unique key for this bullet update
  const debounceKey = `education_bullet_${eduId}_${bulletId}`;
  
  // Get current (pre-update) state for history
  const beforeState = { ...currentState };

  const newSections = {
    ...currentState.sections,
    education: currentState.sections.education.map(section => {
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
  
  const afterState = { ...currentState, sections: newSections };
  
  // Debounce the history update to avoid recording every keystroke
  debounce(debounceKey, () => {
    updateHistory(
      HistoryActionType.UPDATE_BULLET,
      beforeState,
      afterState,
      'Updated education bullet',
      setHistory
    );
  });
  
  // Still update the state immediately, but don't record in history yet
  setHistory((prev: HistoryState) => ({
    ...prev,
    currentState: afterState
  }));
};

// Similarly modify other update functions with debouncing
export const updateExperience = (
  currentState: AppState,
  index: number,
  field: keyof ExperienceSection,
  value: string,
  setHistory: Function
) => {
  const debounceKey = `experience_${index}_${field}`;
  const beforeState = { ...currentState };
  
  const newSections = {
    ...currentState.sections,
    experience: currentState.sections.experience.map((exp, i) => {
      if (i === index) {
        return { ...exp, [field]: value };
      }
      return exp;
    }),
  };
  
  const afterState = { ...currentState, sections: newSections };
  
  debounce(debounceKey, () => {
    updateHistory(
      HistoryActionType.UPDATE_SECTION,
      beforeState,
      afterState,
      `Updated experience ${field}`,
      setHistory
    );
  });
  
  setHistory((prev: HistoryState) => ({
    ...prev,
    currentState: afterState
  }));
};

export const updateExperienceBullet = (
  currentState: AppState,
  expIndex: number,
  bulletIndex: number,
  value: string,
  setHistory: Function
) => {
  const expId = currentState.sections.experience[expIndex]?.id;
  const bulletId = currentState.sections.experience[expIndex]?.bullets[bulletIndex]?.id;

  if (!expId || !bulletId) return;
  
  const debounceKey = `experience_bullet_${expId}_${bulletId}`;
  const beforeState = { ...currentState };

  const newSections = {
    ...currentState.sections,
    experience: currentState.sections.experience.map(section => {
      if (section.id === expId) {
        return {
          ...section,
          bullets: section.bullets.map(b => (b.id === bulletId ? { ...b, text: value } : b)),
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
      'Updated experience bullet',
      setHistory
    );
  });
  
  setHistory((prev: HistoryState) => ({
    ...prev,
    currentState: afterState
  }));
};

export const updateProject = (
  currentState: AppState,
  index: number,
  field: keyof ProjectSection,
  value: string,
  setHistory: Function
) => {
  const debounceKey = `project_${index}_${field}`;
  const beforeState = { ...currentState };
  
  const newSections = {
    ...currentState.sections,
    projects: currentState.sections.projects.map((proj, i) => {
      if (i === index) {
        return { ...proj, [field]: value };
      }
      return proj;
    }),
  };
  
  const afterState = { ...currentState, sections: newSections };
  
  debounce(debounceKey, () => {
    updateHistory(
      HistoryActionType.UPDATE_SECTION,
      beforeState,
      afterState,
      `Updated project ${field}`,
      setHistory
    );
  });
  
  setHistory((prev: HistoryState) => ({
    ...prev,
    currentState: afterState
  }));
};

export const updateProjectBullet = (
  currentState: AppState,
  projIndex: number,
  bulletIndex: number,
  value: string,
  setHistory: Function
) => {
  const projId = currentState.sections.projects[projIndex]?.id;
  const bulletId = currentState.sections.projects[projIndex]?.bullets[bulletIndex]?.id;

  if (!projId || !bulletId) return;
  
  const debounceKey = `project_bullet_${projId}_${bulletId}`;
  const beforeState = { ...currentState };

  const newSections = {
    ...currentState.sections,
    projects: currentState.sections.projects.map(section => {
      if (section.id === projId) {
        return {
          ...section,
          bullets: section.bullets.map(b => (b.id === bulletId ? { ...b, text: value } : b)),
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
      'Updated project bullet',
      setHistory
    );
  });
  
  setHistory((prev: HistoryState) => ({
    ...prev,
    currentState: afterState
  }));
};

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

// ***** MODIFIED *****
// Initial state now returns HistoryState with events array
export const getInitialHistoryState = (): HistoryState => {
  const initialState: AppState = {
    sections: {
      education: [{
        id: 'initial-edu-1',
        school: '', degree: '', location: '', dates: '',
        bullets: [{ id: crypto.randomUUID(), text: '' }]
      }],
      experience: [{
        id: 'initial-exp-1',
        title: '', organization: '', location: '', dates: '',
        bullets: [
          { id: crypto.randomUUID(), text: '' },
          { id: crypto.randomUUID(), text: '' },
          { id: crypto.randomUUID(), text: '' }
        ]
      }],
      projects: [{
        id: 'initial-proj-1',
        name: '', tech: '', dates: '',
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
    name: '',
    contact: {
      phone: '', email: '', website: '', linkedin: '', github: ''
    }
  };

  // Create initial event
  const initialEvent: HistoryEvent = {
    type: HistoryActionType.BATCH_UPDATE,
    beforeState: initialState, // Same as currentState for first event
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

// ***** MODIFIED *****
// Save the current AppState
export const saveToLocalStorage = (historyState: HistoryState) => {
  try {
    const dataToSave = {
      currentState: historyState.currentState,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('resumeEditorData', JSON.stringify(dataToSave));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
};

// ***** MODIFIED *****
// Load state from localStorage, returning a complete AppState or null
export const loadFromLocalStorage = (): AppState | null => {
  try {
    const savedData = localStorage.getItem('resumeEditorData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Basic validation: Check if essential parts exist
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

  // Return null if nothing valid in localStorage or error
  return null;
};

// Clear localStorage data (remains the same)
export const clearLocalStorage = () => {
  try {
    localStorage.removeItem('resumeEditorData');
    console.log('Cleared localStorage');
  } catch (err) {
    console.error('Error clearing localStorage:', err);
  }
};

// ***** ADDED *****
// Get history stats
export const getHistoryStats = (historyState: HistoryState) => {
  return {
    totalEvents: historyState.events.length,
    currentPosition: historyState.currentIndex + 1,
    canUndo: historyState.currentIndex > 0,
    canRedo: historyState.currentIndex < historyState.events.length - 1,
    lastEvent: historyState.events[historyState.currentIndex]?.description || 'None'
  };
};

// ***** ADDED *****
// Helper to get action descriptions for UI
export const getRecentActions = (historyState: HistoryState, count: number = 5) => {
  // Get up to 'count' most recent actions before the current position
  const startIdx = Math.max(0, historyState.currentIndex - count);
  const endIdx = historyState.currentIndex;
  
  return historyState.events
    .slice(startIdx, endIdx + 1)  
    .map(event => ({
      description: event.description,
      timestamp: new Date(event.timestamp).toLocaleTimeString(),
      isCurrent: historyState.events.indexOf(event) === historyState.currentIndex
    }))
    .reverse(); // Most recent first
};