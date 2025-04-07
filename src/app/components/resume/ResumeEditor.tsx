"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  IconDownload,
  IconDeviceFloppy,
  IconX,
  IconAlertCircle,
} from '@tabler/icons-react';
import {
  // Interfaces
  Contact,
  AppState,
  HistoryState,
  HistoryActionType,
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
  getHistoryStats,
  getRecentActions,
  saveResume,
} from './resumeEditor';
import { useAuth } from '@/app/contexts/AuthContext';
import { resumeService } from '@/app/services/resumeService';

// Save Dialog component
interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resumeName: string) => void;
  initialName: string;
  isProcessing: boolean;
  confirmOverwrite?: boolean;
  onConfirmOverwrite?: (resumeName: string) => void;
  saveStatus?: 'success' | 'error' | null;
  errorMessage?: string;
}

const SaveDialog: React.FC<SaveDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialName, 
  isProcessing,
  confirmOverwrite = false,
  onConfirmOverwrite,
  saveStatus = null,
  errorMessage = ''
}) => {
  const [resumeName, setResumeName] = useState(initialName || '');
  const { theme } = useTheme();

  useEffect(() => {
    if (isOpen && initialName) {
      setResumeName(initialName);
    }
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resumeName.trim()) {
      onSave(resumeName.trim());
    }
  };

  // Render success state
  if (saveStatus === 'success') {
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center">
        <div className={`w-full max-w-md rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
          <div className="flex flex-col items-center py-6">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className={`text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
              Resume Saved!
            </h3>
            <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Your resume "{resumeName}" has been saved successfully.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (saveStatus === 'error') {
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center">
        <div className={`w-full max-w-md rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
          <div className="flex flex-col items-center py-6">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className={`text-xl font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
              Save Failed
            </h3>
            <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              {errorMessage || "There was an error saving your resume. Please try again."}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(resumeName)}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main dialog UI for input or confirmation
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center">
      <div className={`w-full max-w-md rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {confirmOverwrite ? 'Resume Already Exists' : 'Save Resume'}
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <IconX size={20} />
          </button>
        </div>

        {confirmOverwrite ? (
          <div>
            <div className="flex items-start mb-4">
              <IconAlertCircle size={24} className="text-orange-500 mr-2 mt-0.5" />
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                A resume named <strong>"{resumeName}"</strong> already exists. Would you like to overwrite it?
              </p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirmOverwrite && onConfirmOverwrite(resumeName)}
                className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
                disabled={isProcessing}
              >
                {isProcessing ? 'Saving...' : 'Overwrite'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label 
                htmlFor="resume-name" 
                className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                Resume Title
              </label>
              <input
                id="resume-name"
                type="text"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                placeholder="Enter a title for your resume (e.g., 'Software Engineer 2023')"
                className={`w-full px-3 py-2 rounded-md border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                autoFocus
              />
              <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                This is just the document title and won't appear on your resume.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={!resumeName.trim() || isProcessing}
              >
                {isProcessing ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Add a new LoginDialog component after the SaveDialog component
interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ 
  isOpen, 
  onClose, 
  onLogin 
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center">
      <div className={`w-full max-w-md rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Sign In Required
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <IconX size={20} />
          </button>
        </div>

        <div className="flex items-start mb-6">
          <IconAlertCircle size={24} className="text-blue-500 mr-2 mt-0.5" />
          <div>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              You need to be signed in to save your resume.
            </p>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
              Create an account to save your work and access it from any device.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Cancel
          </button>
          <button
            onClick={onLogin}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

// Add after the LoginDialog component
interface OptionsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  options: {
    contactFields: Record<string, boolean>;
    sectionVisibility: Record<string, boolean>;
  };
  onToggleContactField: (field: string) => void;
  onToggleSection: (section: string) => void;
}

const OptionsDropdown: React.FC<OptionsDropdownProps> = ({
  isOpen,
  onClose,
  options,
  onToggleContactField,
  onToggleSection
}) => {
  const { theme } = useTheme();
  
  if (!isOpen) return null;
  
  // Use event.stopPropagation to prevent clicks inside the dropdown from closing it
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div
      className="fixed inset-0 z-40"
      onClick={onClose}
    >
      <div 
        className={`fixed w-64 max-h-[400px] overflow-y-auto rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-3 z-50 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
        onClick={handleDropdownClick}
        style={{ top: 'var(--dropdown-top)', left: 'var(--dropdown-left)' }}
      >
        <div className="mb-3">
          <h3 className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Resume Options
          </h3>
          <div className={`h-px w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} my-2`}></div>
        </div>
        
        <div className="mb-3">
          {/* Contact section toggle */}
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Contact Section
            </h4>
            <button
              onClick={() => onToggleSection('contact')}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${options.sectionVisibility.contact ? (theme === 'dark' ? 'bg-blue-600' : 'bg-blue-600') : (theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300')}`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${options.sectionVisibility.contact ? 'translate-x-5' : 'translate-x-1'}`}
              />
            </button>
          </div>
          
          {/* Only show contact fields if contact section is visible */}
          {options.sectionVisibility.contact && (
            <div className={`ml-3 pt-1 pl-2 border-l ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>Contact Fields:</p>
              <div className="space-y-2">
                {Object.entries(options.contactFields).map(([field, visible]) => (
                  <div key={field} className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </span>
                    <button
                      onClick={() => onToggleContactField(field)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${visible ? (theme === 'dark' ? 'bg-blue-600' : 'bg-blue-600') : (theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300')}`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${visible ? 'translate-x-5' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div>
          <h4 className={`text-xs font-medium uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Resume Sections
          </h4>
          <div className="space-y-2">
            {Object.entries(options.sectionVisibility)
              .filter(([section]) => section !== 'contact') // Don't repeat the contact section here
              .map(([section, visible]) => (
                <div key={section} className="flex items-center justify-between">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </span>
                  <button
                    onClick={() => onToggleSection(section)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${visible ? (theme === 'dark' ? 'bg-blue-600' : 'bg-blue-600') : (theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300')}`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${visible ? 'translate-x-5' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResumeEditor: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  // Initialize with default state first
  const [history, setHistory] = useState<HistoryState>(() => getInitialHistoryState());
  const [historyStats, setHistoryStats] = useState(() => getHistoryStats(history));
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const [resumeToCheck, setResumeToCheck] = useState('');
  const [suggestedTitle, setSuggestedTitle] = useState('My Resume');
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState('');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [visibilityOptions, setVisibilityOptions] = useState({
    // Default values
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
  });
  
  // Get current state from history
  const currentState = history.currentState;
  const { sections, name, contact } = currentState;

  // Load data from localStorage on initial render (client side only)
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
        
        // Check if there's a saved resumeId in localStorage
        try {
          const savedData = localStorage.getItem('resumeEditorData');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData.resumeId) {
              setResumeId(parsedData.resumeId);
              
              // If this is a loaded resume, get its title to use as default when saving
              const getResumeTitle = async () => {
                try {
                  const resumeData = await resumeService.getResume(parsedData.resumeId);
                  if (resumeData && resumeData.title) {
                    setSuggestedTitle(resumeData.title);
                  }
                } catch (err) {
                  console.error("Error fetching resume title:", err);
                }
              };
              
              getResumeTitle();
            }
          }
        } catch (err) {
          console.error('Error reading resumeId from localStorage:', err);
        }
      }
      // If nothing loaded, the initial state from useState is used.

      // Initialize visibility options from localStorage
      if (loadedState?.visibilityOptions) {
        setVisibilityOptions(loadedState.visibilityOptions);
      }
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

  // Update history stats whenever history changes
  useEffect(() => {
    setHistoryStats(getHistoryStats(history));
  }, [history]);

  // History stats for UI or debugging
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

  // Update the handleDownloadPDF function to include visibility options
  const handleDownloadPDF = async () => {
    if (!currentState) {
      console.error("Resume data is not available");
      alert("Resume data is not available.");
      return;
    }

    try {
      setIsGeneratingPDF(true);
      console.log("Sending data to generate PDF:", currentState);

      // Make API call to generate PDF, including visibility options
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: currentState,
          visibilityOptions: visibilityOptions
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      // Check if the response is an error
      if (!response.ok) {
        let errorMessage = "Failed to generate PDF";

        // Try to parse the error response
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
            console.error("Error details:", errorData);
          } else {
            const errorText = await response.text();
            console.error("Error response (not JSON):", errorText);
            errorMessage = `Server error: ${response.status} ${response.statusText}. ${errorText.substring(0, 100)}`;
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }

        throw new Error(errorMessage);
      }

      // Verify we got a PDF
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/pdf")) {
        console.error("Expected a PDF but got:", contentType);
        // Attempt to read response as text for more clues
        const responseText = await response.text();
        console.error("Response body (non-PDF):", responseText.substring(0, 500)); // Log first 500 chars
        throw new Error(`Invalid response format. Expected PDF, but got ${contentType}.`);
      }

      // Get the PDF blob from the response
      const pdfBlob = await response.blob();
      console.log("PDF blob received, size:", pdfBlob.size);

      // Create a download link and trigger the download
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      const safeName = currentState.name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'resume';
      downloadLink.download = `${safeName}_resume.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up the URL object
      URL.revokeObjectURL(downloadUrl);
      console.log("Download completed");
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error generating PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsGeneratingPDF(false);
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
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
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

  // Start the save process by opening the dialog
  const handleOpenSaveDialog = () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }
    
    setSaveError(null);
    
    // Check if we have a resumeId from localStorage
    if (resumeId) {
      // If we have a resumeId, try to get the associated title from the database
      const getResumeTitle = async () => {
        try {
          const resumeData = await resumeService.getResume(resumeId);
          if (resumeData && resumeData.title) {
            setSuggestedTitle(resumeData.title);
            setShowSaveDialog(true);
          } else {
            // Fallback to name-based title if we can't get the original title
            const newSuggestedTitle = currentState.name ? 
              `${currentState.name.split(' ')[0]}'s Resume` : 
              'My Resume';
            setSuggestedTitle(newSuggestedTitle);
            setShowSaveDialog(true);
          }
        } catch (err) {
          console.error("Error fetching resume title:", err);
          // Fallback to name-based title
          const newSuggestedTitle = currentState.name ? 
            `${currentState.name.split(' ')[0]}'s Resume` : 
            'My Resume';
          setSuggestedTitle(newSuggestedTitle);
          setShowSaveDialog(true);
        }
      };
      
      getResumeTitle();
    } else {
      // No resumeId, use name-based title
      const newSuggestedTitle = currentState.name ? 
        `${currentState.name.split(' ')[0]}'s Resume` : 
        'My Resume';
      setSuggestedTitle(newSuggestedTitle);
      setShowSaveDialog(true);
    }
  };

  // Check if resume with this name exists
  const checkResumeExists = async (resumeName) => {
    try {
      // Don't set isSaving true yet, just when checking for existence
      const checkingState = true;
      setSaveStatus(null);
      
      // Get all resumes for this user
      const userResumes = await resumeService.getUserResumes(user.uid);
      
      // Check if a resume with this name exists
      const existingResume = userResumes.find(r => r.title.toLowerCase() === resumeName.toLowerCase());
      
      if (existingResume) {
        // Store the resume ID for potential overwrite
        setResumeId(existingResume.id);
        setResumeToCheck(resumeName);
        setShowSaveDialog(false);
        setShowOverwriteConfirm(true);
      } else {
        // No conflict, proceed with save
        setIsSaving(true); // Only now set isSaving to true
        proceedWithSave(resumeName);
      }
    } catch (error) {
      console.error('Error checking existing resumes:', error);
      setSaveStatus('error');
      setSaveErrorMessage('Error checking existing resumes: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setIsSaving(false);
    }
  };

  // Proceed with actual save operation
  const proceedWithSave = async (resumeTitle) => {
    try {
      // Don't update the name in current state - keep them separate
      // We're only saving the resume with this title, not changing the person's name

      // Save to Firebase
      const savedResumeId = await saveResume(history.currentState, resumeId, resumeTitle);
      setResumeId(savedResumeId);
      
      // Show success status
      setSaveStatus('success');
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
        setShowSaveDialog(false);
        setShowOverwriteConfirm(false);
      }, 3000);
      
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving resume:', error);
      setSaveStatus('error');
      setSaveErrorMessage(error instanceof Error ? error.message : 'Failed to save resume');
      setIsSaving(false);
    }
  };

  // Handle the confirmation to overwrite
  const handleOverwriteConfirm = async (resumeName) => {
    // Now set isSaving to true since user confirmed
    setIsSaving(true);
    await proceedWithSave(resumeName);
  };

  // Add handler for login button
  const handleLogin = () => {
    // Close the login dialog
    setShowLoginDialog(false);
    // Navigate to login page
    window.location.href = '/login';
  };

  // Add these handler functions
  const toggleContactField = (field: string) => {
    setVisibilityOptions(prev => ({
      ...prev,
      contactFields: {
        ...prev.contactFields,
        [field]: !prev.contactFields[field as keyof typeof prev.contactFields]
      }
    }));
  };

  const toggleSection = (section: string) => {
    setVisibilityOptions(prev => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [section]: !prev.sectionVisibility[section as keyof typeof prev.sectionVisibility]
      }
    }));
  };

  // Modify the JSX containing the Resume Options button - adjust this button to have a ref we can use
  // Add useRef and position calculation in the ResumeEditor component
  const optionsButtonRef = useRef<HTMLButtonElement>(null);
  const [optionsPosition, setOptionsPosition] = useState({ top: 0, left: 0 });

  // Update position when button is clicked
  const handleToggleOptions = () => {
    if (optionsButtonRef.current) {
      const rect = optionsButtonRef.current.getBoundingClientRect();
      // Apply position directly to document root as CSS variables
      document.documentElement.style.setProperty('--dropdown-top', `${rect.bottom + 5}px`);
      document.documentElement.style.setProperty('--dropdown-left', `${rect.left}px`);
    }
    setShowOptions(!showOptions);
  };

  // Add useEffect to update the history state when visibility options change
  useEffect(() => {
    if (history && history.currentState) {
      setHistory(prev => {
        const newState = {
          ...prev,
          currentState: {
            ...prev.currentState,
            visibilityOptions
          }
        };
        return newState;
      });
    }
  }, [visibilityOptions]);

  // Handle complete dialog close
  const handleCloseDialog = () => {
    // If closing from success or error state, close everything
    if (saveStatus === 'success' || saveStatus === 'error') {
      setShowSaveDialog(false);
      setShowOverwriteConfirm(false);
      setSaveStatus(null);
    } else {
      // If closing the overwrite dialog, return to the save dialog
      if (showOverwriteConfirm) {
        setShowOverwriteConfirm(false);
        setShowSaveDialog(true);
      } else {
        // Otherwise just close the save dialog
        setShowSaveDialog(false);
      }
      setSaveStatus(null);
    }
  };

  // --- JSX ---
  return (
    <div className="flex flex-col">
      {/* Header Controls Bar */}
      <div className={`w-full ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm sticky top-0 z-10 py-3 px-4`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left Buttons */}
          <div className="flex items-center space-x-3">
            <button 
              ref={optionsButtonRef}
              onClick={handleToggleOptions}
              className={`flex items-center space-x-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'} border rounded-md px-3 py-1.5 transition-colors relative z-50`}
            >
              <IconUser size={18} stroke={1.5} className={theme === 'dark' ? 'text-gray-300' : ''} />
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : ''}`}>Resume Options</span>
              <IconChevronDown size={16} stroke={1.5} className={theme === 'dark' ? 'text-gray-300' : ''} />
            </button>
            
            <button 
              onClick={handleOpenSaveDialog}
              disabled={isSaving}
              className={`flex items-center space-x-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'} border rounded-md px-3 py-1.5 transition-colors disabled:opacity-50`}
            >
              <IconDeviceFloppy size={18} stroke={1.5} className={theme === 'dark' ? 'text-gray-300' : ''} />
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                {isSaving ? 'Saving...' : 'Save'}
              </span>
            </button>

            {/* Save Status Messages */}
            {saveError && (
              <div className="text-red-500 text-sm">
                {saveError}
              </div>
            )}
            {saveSuccess && (
              <div className="text-green-500 text-sm">
                Resume saved successfully!
              </div>
            )}
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

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className={`flex items-center space-x-2 ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md px-4 py-1.5 mr-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Download PDF"
            >
              {isGeneratingPDF ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <IconDownload size={18} stroke={1.5} />
                  <span className="text-sm font-medium">Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={() => {}}
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
            contact={visibilityOptions.sectionVisibility.contact ? {
              ...contact,
              // Only pass fields that are visible
              phone: visibilityOptions.contactFields.phone ? contact.phone : '',
              email: visibilityOptions.contactFields.email ? contact.email : '',
              website: visibilityOptions.contactFields.website ? contact.website : '',
              linkedin: visibilityOptions.contactFields.linkedin ? contact.linkedin : '',
              github: visibilityOptions.contactFields.github ? contact.github : '',
            } : {
              phone: '',
              email: '',
              website: '',
              linkedin: '',
              github: ''
            }}
            setName={handleUpdateName}
            updateContact={handleUpdateContact}
            showContactInfo={visibilityOptions.sectionVisibility.contact}
          />

          {visibilityOptions.sectionVisibility.education && (
            <EducationSection
              educations={sections.education.map(edu => ({
                id: edu.id,
                school: edu.school,
                degree: edu.degree,
                location: edu.location,
                dates: edu.dates,
                category: edu.category,
                skills: edu.skills
              }))}
              sectionTitle={sections.educationTitle}
              updateSectionTitle={(value) => handleUpdateSectionTitle('educationTitle', value)}
              updateEducation={handleUpdateEducation}
              onAddNew={() => handleAddSection('education')}
              deleteSection={(id) => handleDeleteSection('education', id)}
            />
          )}

          {visibilityOptions.sectionVisibility.experience && (
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
          )}

          {visibilityOptions.sectionVisibility.projects && (
            <ProjectsSection
              projects={sections.projects.map(proj => ({
                id: proj.id,
                name: proj.name,
                tech: proj.tech,
                dates: proj.dates,
                bullets: proj.bullets.map(bullet => bullet.text)
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
          )}

          {visibilityOptions.sectionVisibility.additional && (
            <AdditionalSection
              sectionTitle={sections.additionalTitle}
              updateSectionTitle={(value) => handleUpdateSectionTitle('additionalTitle', value)}
              skills={sections.skills}
              updateSkill={handleUpdateSkill}
              addSkillCategory={handleAddSkillCategory}
              deleteSection={(id) => handleDeleteSection('skills', id)}
            />
          )}
        </div>
      </div>

      {/* Save Dialog */}
      <SaveDialog
        isOpen={showSaveDialog}
        onClose={handleCloseDialog}
        onSave={checkResumeExists}
        initialName={suggestedTitle}
        isProcessing={isSaving}
        saveStatus={saveStatus}
        errorMessage={saveErrorMessage}
      />

      {/* Overwrite Confirmation Dialog */}
      <SaveDialog
        isOpen={showOverwriteConfirm}
        onClose={handleCloseDialog}
        onSave={() => {}}
        initialName={resumeToCheck}
        isProcessing={isSaving}
        confirmOverwrite={true}
        onConfirmOverwrite={handleOverwriteConfirm}
        saveStatus={saveStatus}
        errorMessage={saveErrorMessage}
      />

      {/* Login Dialog */}
      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onLogin={handleLogin}
      />

      {/* Options Dropdown */}
      {showOptions && (
        <OptionsDropdown
          isOpen={showOptions}
          onClose={() => setShowOptions(false)}
          options={visibilityOptions}
          onToggleContactField={toggleContactField}
          onToggleSection={toggleSection}
        />
      )}
    </div>
  );
};

export default ResumeEditor;