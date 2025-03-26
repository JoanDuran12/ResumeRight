'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Resume, ResumeContent, resumeService } from '../services/resumeService';
import { useAuth } from './AuthContext';

interface ResumeContextType {
  currentResume: Resume | null;
  loading: boolean;
  error: string | null;
  createNewResume: (title: string, templateId: string, initialContent: ResumeContent) => Promise<string>;
  loadResume: (resumeId: string) => Promise<void>;
  updateContent: (content: Partial<ResumeContent>) => Promise<void>;
  generateAndUpdateLatex: () => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewResume = useCallback(async (
    title: string,
    templateId: string,
    initialContent: ResumeContent
  ): Promise<string> => {
    if (!user) throw new Error('User must be logged in to create a resume');
    
    setLoading(true);
    setError(null);
    
    try {
      const resumeId = await resumeService.createResume(
        user.uid,
        title,
        templateId,
        initialContent
      );
      
      const newResume = await resumeService.getResume(resumeId);
      if (newResume) {
        setCurrentResume(newResume);
      }
      
      return resumeId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resume');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadResume = useCallback(async (resumeId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const resume = await resumeService.getResume(resumeId);
      if (resume) {
        setCurrentResume(resume);
      } else {
        setError('Resume not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resume');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContent = useCallback(async (content: Partial<ResumeContent>) => {
    if (!currentResume) throw new Error('No resume is currently loaded');
    
    setLoading(true);
    setError(null);
    
    try {
      await resumeService.updateResumeContent(currentResume.id, content);
      setCurrentResume(prev => prev ? {
        ...prev,
        content: { ...prev.content, ...content }
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resume content');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentResume]);

  const generateAndUpdateLatex = useCallback(async () => {
    if (!currentResume) throw new Error('No resume is currently loaded');
    
    setLoading(true);
    setError(null);
    
    try {
      // Here you would implement the logic to convert the content to LaTeX
      // This is a placeholder - you'll need to implement the actual conversion
      const latexContent = await convertToLatex(currentResume.content, currentResume.templateId);
      
      await resumeService.updateLatexContent(currentResume.id, latexContent);
      setCurrentResume(prev => prev ? {
        ...prev,
        latexContent
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate LaTeX');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentResume]);

  const value = {
    currentResume,
    loading,
    error,
    createNewResume,
    loadResume,
    updateContent,
    generateAndUpdateLatex
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}

// Placeholder function - you'll need to implement the actual conversion logic
async function convertToLatex(content: ResumeContent, templateId: string): Promise<string> {
  // This is where you'll implement the logic to convert the content to LaTeX
  // based on the selected template
  throw new Error('Not implemented');
} 