'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useResume } from '@/app/contexts/ResumeContext';
import styles from '@/app/resume.module.css';
import EditableText from './components/EditableText';
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
  IconFileUpload 
} from '@tabler/icons-react';
import {
  Contact,
  HistoryState,
  Sections,
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
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage
} from './resumeEditor';



const ResumeEditor: React.FC = () => {
  const { currentResume, updateContent } = useResume();
  const [name, setName] = useState('');
  const [contact, setContact] = useState<Contact>({
    phone: '',
    email: '',
    website: '',
    linkedin: '',
    github: ''
  });
  const [history, setHistory] = useState<HistoryState>(getInitialHistoryState());

  const sections = history.present;

  // Load data from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { sections, name: savedName, contact: savedContact } = loadFromLocalStorage();
      
      if (sections) {
        setHistory(prev => ({
          ...prev,
          present: sections
        }));
      }
      
      if (savedName) {
        setName(savedName);
      }
      
      if (savedContact) {
        setContact(savedContact);
      }
    }
  }, []);

  // Save to localStorage whenever relevant state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage(sections, name, contact);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [sections, name, contact]);

  const updateContact = (field: string, value: string) => {
    setContact(prev => ({ ...prev, [field]: value }));
  };

  const handleUndo = useCallback(() => {
    undo(setHistory);
  }, []);

  const handleRedo = useCallback(() => {
    redo(setHistory);
  }, []);

  const handleClearResume = () => {
    if (window.confirm('Are you sure you want to clear all resume data? This action cannot be undone.')) {
      setHistory(getInitialHistoryState());
      setName('');
      setContact({
        phone: '',
        email: '',
        website: '',
        linkedin: '',
        github: ''
      });
      clearLocalStorage();
    }
  };

  const handleImportPDF = () => {
    // PDF import logic here
    alert('PDF import functionality will be implemented here');
  };

  const handleModifySections = () => {
    // Sections modification logic
  };

  const handleModifyHeader = () => {
    // Header modification logic
  };

  const handleDeleteSection = (sectionType: 'education' | 'experience' | 'projects' | 'skills', id: string) => {
    deleteSection(sections, sectionType, id, setHistory);
  };

  const handleDeleteBullet = (sectionType: 'education' | 'experience' | 'projects', sectionId: string, bulletId: string) => {
    deleteBullet(sections, sectionType, sectionId, bulletId, setHistory);
  };

  const handleAddBullet = (sectionType: 'education' | 'experience' | 'projects', sectionId: string) => {
    addBullet(sections, sectionType, sectionId, setHistory);
  };

  const handleAddSkillCategory = () => {
    addSkillCategory(sections, setHistory);
  };

  const handleAddSection = (sectionType: 'education' | 'experience' | 'projects') => {
    addSection(sections, sectionType, setHistory);
  };

  const handleUpdateEducation = (index: number, field: string, value: string) => {
    updateEducation(sections, index, field, value, setHistory);
  };

  const handleUpdateEducationBullet = (eduIndex: number, bulletIndex: number, value: string) => {
    updateEducationBullet(sections, eduIndex, bulletIndex, value, setHistory);
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

  const handleUpdateExperience = (index: number, field: string, value: string) => {
    updateExperience(sections, index, field, value, setHistory);
  };

  const handleUpdateExperienceBullet = (expIndex: number, bulletIndex: number, value: string) => {
    updateExperienceBullet(sections, expIndex, bulletIndex, value, setHistory);
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

  const handleUpdateProject = (index: number, field: string, value: string) => {
    updateProject(sections, index, field, value, setHistory);
  };

  const handleUpdateProjectBullet = (projIndex: number, bulletIndex: number, value: string) => {
    updateProjectBullet(sections, projIndex, bulletIndex, value, setHistory);
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

  const handleUpdateSkill = (index: number, field: string, value: string) => {
    updateSkill(sections, index, field, value, setHistory);
  };

  const handleUpdateSectionTitle = (sectionType: 'additionalTitle' | 'educationTitle' | 'experienceTitle' | 'projectsTitle', value: string) => {
    updateSectionTitle(sections, sectionType, value, setHistory);
  };

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

  const { theme } = useTheme();
  
  return (
    
    <div className="flex flex-col">
      {/* Header Controls Bar */}
      <div className={`w-full ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm sticky top-0 z-10 py-3 px-4`}>
  <div className="max-w-7xl mx-auto flex justify-between items-center">
    <div className="flex items-center space-x-3">
      <button 
        onClick={handleModifyHeader}
        className={`flex items-center space-x-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'} border rounded-md px-3 py-1.5 transition-colors`}
      >
        <IconUser size={18} stroke={1.5} className={theme === 'dark' ? 'text-gray-300' : ''} />
        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : ''}`}>Contact Header</span>
        <IconChevronDown size={16} stroke={1.5} className={theme === 'dark' ? 'text-gray-300' : ''} />
      </button>
      
      <button 
        onClick={handleModifySections}
        className={`flex items-center space-x-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'} border rounded-md px-3 py-1.5 transition-colors`}
      >
        <IconLayoutList size={18} stroke={1.5} className={theme === 'dark' ? 'text-gray-300' : ''} />
        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : ''}`}>Content Blocks</span>
        <IconChevronDown size={16} stroke={1.5} className={theme === 'dark' ? 'text-gray-300' : ''} />
      </button>
    </div>
    
    <div className="flex items-center">
      <div className="flex items-center mr-4">
        <button 
          onClick={handleUndo} 
          disabled={history.past.length === 0}
          className={`p-1.5 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} rounded-l-md border disabled:opacity-40 transition-colors`}
          title="Undo"
        >
          <IconArrowBackUp size={18} stroke={1.5} className={theme === 'dark' ? 'text-gray-300' : ''} />
        </button>
        
        <button 
          onClick={handleRedo} 
          disabled={history.future.length === 0}
          className={`p-1.5 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} rounded-r-md border border-l-0 disabled:opacity-40 transition-colors`}
          title="Redo"
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
        onClick={handleImportPDF}
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
          {/* Header Section */}
          <ResumeHeader
            name={name}
            contact={contact}
            setName={setName}
            updateContact={updateContact}
          />

          {/* Education Section */}
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

          {/* Experience Section */}
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

          {/* Projects Section */}
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

          {/* Additional Section */}
          <AdditionalSection
            sectionTitle={sections.additionalTitle}
            updateSectionTitle={(value) => handleUpdateSectionTitle('additionalTitle', value)}
            skills={sections.skills}
            updateSkill={handleUpdateSkill}
            addSkillCategory={handleAddSkillCategory}
            deleteSection={(id) => handleDeleteSection('skills', id)}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;