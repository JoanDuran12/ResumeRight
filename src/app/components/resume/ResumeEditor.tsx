'use client';

import React, { useEffect, useState, useCallback } from 'react';
import styles from '@/app/resume.module.css';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import EducationSection from './components/EducationSection';
import ResumeHeader from './components/ResumeHeader';
import AdditionalSection from './components/AdditionalSection';
import { useTheme } from '@/app/contexts/ThemeContext';
import {
  IconUser,
  IconLayoutList,
  IconChevronDown,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconTrash,
  IconFileUpload,
} from '@tabler/icons-react';
import {
  // Interfaces
  Contact,
  AppState,
  HistoryState,
  HistoryEvent,
  HistoryActionType,
  Sections,
  EducationSection as EducationSectionType,
  ExperienceSection as ExperienceSectionType,
  ProjectSection as ProjectSectionType,
  Skill as SkillType,
  // Functions
  getInitialHistoryState,
  undo,
  redo,
  deleteSection,
  deleteBullet,
  addBullet,
  addSkillCategory,
  addSection,
  updateEducation,
  updateEducationBullet,
  updateExperience,
  updateExperienceBullet,
  updateProject,
  updateProjectBullet,
  updateSkill,
  updateSectionTitle,
  updateName,
  updateContactField,
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
  getHistoryStats,    // New function
  getRecentActions,   // New function
} from './resumeEditor';
import { generateLatexResume } from './latexGenerator';

const ResumeEditor: React.FC = () => {
  const [history, setHistory] = useState<HistoryState>(getInitialHistoryState());
  const { theme } = useTheme();

  // Get current state from history
  const currentState = history.currentState;
  const { sections, name, contact } = currentState;

  // Load data from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadedState = loadFromLocalStorage();
      if (loadedState) {
        // Initialize history with loaded state
        const initialEvent = {
          type: HistoryActionType.BATCH_UPDATE,
          beforeState: loadedState, // Same as currentState for first event
          currentState: loadedState,
          timestamp: Date.now(),
          description: 'Loaded from storage'
        };

        setHistory({
          events: [initialEvent],
          currentIndex: 0,
          currentState: loadedState
        });
      }
      // If nothing loaded, the initial state from useState is used.
    }
  }, []); // Run only once on mount

  // Save to localStorage whenever currentState changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Debounce saving to avoid excessive writes
      const timeoutId = setTimeout(() => {
        saveToLocalStorage(history); // Save the entire history state
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [history]);

  // History stats for UI or debugging
  const historyStats = getHistoryStats(history);
  const recentActions = getRecentActions(history, 5);

  // --- Handlers ---
  const handleUpdateName = (newName: string) => {
    updateName(currentState, newName, setHistory);
  };

  const handleUpdateContact = (field: string, value: string) => {
    updateContactField(currentState, field as keyof Contact, value, setHistory);
  };

  const handleUndo = useCallback(() => {
    undo(setHistory);
  }, []);

  const handleRedo = useCallback(() => {
    redo(setHistory);
  }, []);

  const handleClearResume = () => {
    if (window.confirm('Are you sure you want to clear all resume data? This action cannot be undone.')) {
      setHistory(getInitialHistoryState()); // Reset to initial history state
      clearLocalStorage(); // Clear storage as well
    }
  };

  // Section operations
  const handleDeleteSection = (sectionType: 'education' | 'experience' | 'projects' | 'skills', id: string) => {
    deleteSection(currentState, sectionType, id, setHistory);
  };

  const handleDeleteBullet = (sectionType: 'education' | 'experience' | 'projects', sectionId: string, bulletId: string) => {
    deleteBullet(currentState, sectionType, sectionId, bulletId, setHistory);
  };

  const handleAddBullet = (sectionType: 'education' | 'experience' | 'projects', sectionId: string) => {
    addBullet(currentState, sectionType, sectionId, setHistory);
  };

  const handleAddSkillCategory = () => {
    addSkillCategory(currentState, setHistory);
  };

  const handleAddSection = (sectionType: 'education' | 'experience' | 'projects') => {
    addSection(currentState, sectionType, setHistory);
  };

  // Education-specific handlers
  const handleUpdateEducation = (index: number, field: string, value: string) => {
    updateEducation(currentState, index, field as keyof EducationSectionType, value, setHistory);
  };

  const handleUpdateEducationBullet = (eduIndex: number, bulletIndex: number, value: string) => {
    updateEducationBullet(currentState, eduIndex, bulletIndex, value, setHistory);
  };

  const deleteEducationBullet = (eduIndex: number, bulletIndex: number) => {
    const eduId = sections.education[eduIndex]?.id;
    const bulletId = sections.education[eduIndex]?.bullets[bulletIndex]?.id;
    if (eduId && bulletId) {
      handleDeleteBullet('education', eduId, bulletId);
    }
  };

  const addEducationBullet = (eduIndex: number) => {
    const eduId = sections.education[eduIndex]?.id;
    if (eduId) {
      handleAddBullet('education', eduId);
    }
  };

  // Experience-specific handlers
  const handleUpdateExperience = (index: number, field: string, value: string) => {
    updateExperience(currentState, index, field as keyof ExperienceSectionType, value, setHistory);
  };

  const handleUpdateExperienceBullet = (expIndex: number, bulletIndex: number, value: string) => {
    updateExperienceBullet(currentState, expIndex, bulletIndex, value, setHistory);
  };

  const deleteExperienceBullet = (expIndex: number, bulletIndex: number) => {
    const expId = sections.experience[expIndex]?.id;
    const bulletId = sections.experience[expIndex]?.bullets[bulletIndex]?.id;
    if (expId && bulletId) {
      handleDeleteBullet('experience', expId, bulletId);
    }
  };

  const addExperienceBullet = (expIndex: number) => {
    const expId = sections.experience[expIndex]?.id;
    if (expId) {
      handleAddBullet('experience', expId);
    }
  };

  // Project-specific handlers
  const handleUpdateProject = (index: number, field: string, value: string) => {
    updateProject(currentState, index, field as keyof ProjectSectionType, value, setHistory);
  };

  const handleUpdateProjectBullet = (projIndex: number, bulletIndex: number, value: string) => {
    updateProjectBullet(currentState, projIndex, bulletIndex, value, setHistory);
  };

  const deleteProjectBullet = (projIndex: number, bulletIndex: number) => {
    const projectId = sections.projects[projIndex]?.id;
    const bulletId = sections.projects[projIndex]?.bullets[bulletIndex]?.id;
    if (projectId && bulletId) {
      handleDeleteBullet('projects', projectId, bulletId);
    }
  };

  const addProjectBullet = (projIndex: number) => {
    const projectId = sections.projects[projIndex]?.id;
    if (projectId) {
      handleAddBullet('projects', projectId);
    }
  };

  // Skills and section title handlers
  const handleUpdateSkill = (index: number, field: string, value: string) => {
    updateSkill(currentState, index, field as keyof SkillType, value, setHistory);
  };

  const handleUpdateSectionTitle = (sectionType: 'additionalTitle' | 'educationTitle' | 'experienceTitle' | 'projectsTitle', value: string) => {
    updateSectionTitle(currentState, sectionType, value, setHistory);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Optional: Display history status for debugging
  const renderHistoryDebug = () => (
    <div className="text-xs bg-gray-100 p-2 rounded mt-4">
      <div>History Events: {historyStats.totalEvents}</div>
      <div>Current Position: {historyStats.currentPosition}</div>
      <div>Can Undo: {historyStats.canUndo ? 'Yes' : 'No'}</div>
      <div>Can Redo: {historyStats.canRedo ? 'Yes' : 'No'}</div>
      <div>Last Action: {historyStats.lastEvent}</div>
      
      <div className="mt-2">Recent Actions:</div>
      <ul className="list-disc pl-4">
        {recentActions.map((action, i) => (
          <li key={i} className={action.isCurrent ? 'font-bold' : ''}>
            {action.timestamp}: {action.description}
          </li>
        ))}
      </ul>
    </div>
  );

  // --- JSX ---
  return (
    <div className="flex flex-col">
      {/* Header Controls Bar */}
      <div className={`w-full ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm sticky top-0 z-10 py-3 px-4`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left Buttons */}
            <div className="flex items-center space-x-3">
                <button 
              className={`flex items-center space-x-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'} border rounded-md px-3 py-1.5 transition-colors`}
            >
              <IconUser size={18} stroke={1.5} className={theme === 'dark' ? 'text-gray-300' : ''} />
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : ''}`}>Contact Header</span>
              <IconChevronDown size={16} stroke={1.5} className={theme === 'dark' ? 'text-gray-300' : ''} />
            </button>
            
            <button 
              className={`flex items-center space-x-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'} border rounded-md px-3 py-1.5 transition-colors`}
            >
              <IconLayoutList size={18} stroke={1.5} className={theme === 'dark' ? 'text-gray-300' : ''} />
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : ''}`}>Content Blocks</span>
              <IconChevronDown size={16} stroke={1.5} className={theme === 'dark' ? 'text-gray-300' : ''} />
            </button>
          </div>
    
          {/* Right Buttons */}
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <button
                onClick={handleUndo}
                disabled={!historyStats.canUndo} // Use historyStats
                className={`p-1.5 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} rounded-l-md border disabled:opacity-40 transition-colors`}
                title="Undo (Ctrl+Z)"
              >
                <IconArrowBackUp size={18} stroke={1.5} className={theme === 'dark' ? 'text-gray-300' : ''} />
              </button>

              <button
                onClick={handleRedo}
                disabled={!historyStats.canRedo} // Use historyStats
                className={`p-1.5 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} rounded-r-md border border-l-0 disabled:opacity-40 transition-colors`}
                title="Redo (Ctrl+Shift+Z)"
              >
                <IconArrowForwardUp size={18} stroke={1.5} className={theme === 'dark' ? 'text-gray-300' : ''} />
              </button>
            </div>

            <button
              onClick={handleClearResume}
              className={`p-1.5 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} rounded-md border mr-3 transition-colors`}
              title="Clear Resume"
            >
              <IconTrash size={18} stroke={1.5} className="text-red-500" />
            </button>

            <button
              onClick={() => {console.log(generateLatexResume(currentState))}}
              className={`flex items-center space-x-2 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-900 hover:bg-gray-800'} text-white rounded-md px-4 py-1.5 transition-colors`}
            >
              <IconFileUpload size={18} stroke={1.5} />
              <span className="text-sm font-medium">Import PDF</span>
            </button>
            
          </div>
        </div>
      </div>

      {/* Main Resume Editor */}
      <div className="max-w-7xl mx-auto p-4">
        <div className={`${styles.resumePage} min-h-[1140px] w-[1000px] bg-white shadow-md mx-auto`}>
          <ResumeHeader
            name={name}
            contact={contact}
            setName={handleUpdateName}
            updateContact={handleUpdateContact}
          />

          <EducationSection
            educations={sections.education.map(edu => ({
              id: edu.id,
              school: edu.school,
              degree: edu.degree,
              location: edu.location,
              dates: edu.dates,
              bullets: edu.bullets.map(bullet => bullet.text)
            }))}
            sectionTitle={sections.educationTitle}
            updateSectionTitle={(value) => handleUpdateSectionTitle('educationTitle', value)}
            updateEducation={handleUpdateEducation}
            updateEducationBullet={handleUpdateEducationBullet}
            deleteEducationBullet={deleteEducationBullet}
            addEducationBullet={addEducationBullet}
            onAddNew={() => handleAddSection('education')}
            deleteSection={(id) => handleDeleteSection('education', id)}
          />

          <ExperienceSection
            experiences={sections.experience.map(exp => ({
              id: exp.id,
              title: exp.title,
              organization: exp.organization,
              location: exp.location,
              dates: exp.dates,
              bullets: exp.bullets.map(bullet => bullet.text)
            }))}
            sectionTitle={sections.experienceTitle}
            updateSectionTitle={(value) => handleUpdateSectionTitle('experienceTitle', value)}
            updateExperience={handleUpdateExperience}
            updateExperienceBullet={handleUpdateExperienceBullet}
            deleteExperienceBullet={deleteExperienceBullet}
            addExperienceBullet={addExperienceBullet}
            onAddNew={() => handleAddSection('experience')}
            deleteSection={(id) => handleDeleteSection('experience', id)}
          />

          <ProjectsSection
            projects={sections.projects.map(project => ({
              id: project.id,
              name: project.name,
              tech: project.tech,
              dates: project.dates,
              bullets: project.bullets.map(bullet => bullet.text)
            }))}
            sectionTitle={sections.projectsTitle}
            updateSectionTitle={(value) => handleUpdateSectionTitle('projectsTitle', value)}
            updateProject={handleUpdateProject}
            updateProjectBullet={handleUpdateProjectBullet}
            deleteProjectBullet={deleteProjectBullet}
            addProjectBullet={addProjectBullet}
            onAddNew={() => handleAddSection('projects')}
            deleteSection={(id) => handleDeleteSection('projects', id)}
          />

          <AdditionalSection
            sectionTitle={sections.additionalTitle}
            updateSectionTitle={(value) => handleUpdateSectionTitle('additionalTitle', value)}
            skills={sections.skills}
            updateSkill={handleUpdateSkill}
            addSkillCategory={handleAddSkillCategory}
            deleteSection={(id) => handleDeleteSection('skills', id)}
          />
        </div>
        
        {/* Uncomment for debugging */}
        {/* {renderHistoryDebug()} */}
      </div>
    </div>
  );
};

export default ResumeEditor;