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
  updateSectionTitle
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

  const updateContact = (field: string, value: string) => {
    setContact(prev => ({ ...prev, [field]: value }));
  };

  const handleUndo = useCallback(() => {
    undo(setHistory);
  }, []);

  const handleRedo = useCallback(() => {
    redo(setHistory);
  }, []);

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

  return (
    <div className={`${styles.resumePage} min-h-[1140px] w-[1000px]`}>  
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
  );
};

export default ResumeEditor; 