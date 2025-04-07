'use client';

import { IconChevronDown, IconTrash, IconEdit, IconX, IconAlertTriangle, IconAlertCircle, IconArrowRight } from '@tabler/icons-react';
import { useAuth } from "@/app/contexts/AuthContext";
import { useEffect, useState } from 'react';
import { resumeService, Resume } from '@/app/services/resumeService';
import { useRouter } from 'next/navigation';
import { AppState, HistoryState, updateHistory, HistoryActionType } from '@/app/components/resume/resumeEditor';

const formatDate = (date: any) => {
    if (!date) return 'Unknown date';
    
    const dateObject = date.toDate ? date.toDate() : new Date(date);
    
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - dateObject.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
        return 'today';
    } else if (diffDays === 1) {
        return 'yesterday';
    } else if (diffDays < 30) {
        return `${diffDays} days ago`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
};

// Function to convert resume content to app state format
const mapResumeContentToAppState = (resume: Resume): AppState => {
    const { content } = resume;
    
    // Create a basic AppState structure
    const appState: AppState = {
        name: content?.personalInfo?.name || '',
        contact: {
            phone: content?.personalInfo?.phone || '',
            email: content?.personalInfo?.email || '',
            website: content?.personalInfo?.website || '',
            linkedin: content?.personalInfo?.linkedin || '',
            github: content?.personalInfo?.github || '',
        },
        sections: {
            education: content?.education?.map(edu => ({
                id: edu.id || crypto.randomUUID(),
                school: edu.school || '',
                degree: edu.degree || '',
                location: edu.location || '',
                dates: edu.date || '',
                category: edu.category || '',
                skills: edu.skills || '',
            })) || [],
            experience: content?.experience?.map(exp => ({
                id: exp.id || crypto.randomUUID(),
                title: exp.title || '',
                organization: exp.company || '',
                location: exp.location || '',
                dates: `${exp.startDate || ''} - ${exp.endDate || ''}`,
                bullets: exp.bullets || [],
            })) || [],
            projects: content?.projects?.map(proj => ({
                id: proj.id || crypto.randomUUID(),
                name: proj.name || '',
                tech: proj.tech || '',
                dates: proj.dates || '',
                bullets: proj.bullets || [],
            })) || [],
            skills: content?.skills?.map(skill => ({
                id: skill.id || crypto.randomUUID(),
                category: skill.category || '',
                skills: skill.skills || '',
            })) || [],
            educationTitle: content?.sectionTitles?.educationTitle || 'Education',
            experienceTitle: content?.sectionTitles?.experienceTitle || 'Experience',
            projectsTitle: content?.sectionTitles?.projectsTitle || 'Projects',
            additionalTitle: content?.sectionTitles?.additionalTitle || 'Additional',
        }
    };
    
    return appState;
};

// Delete Confirmation Dialog
interface DeleteDialogProps {
    isOpen: boolean;
    resumeTitle: string;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
    isOpen,
    resumeTitle,
    onClose,
    onConfirm,
    isDeleting
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center">
            <div className="w-full max-w-md rounded-lg shadow-xl bg-white dark:bg-gray-800 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Delete Resume
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <IconX size={20} />
                    </button>
                </div>

                <div className="flex items-start mb-4">
                    <IconAlertTriangle size={24} className="text-red-500 mr-2 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">
                        Are you sure you want to delete <strong>"{resumeTitle}"</strong>? This action cannot be undone.
                    </p>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Edit Confirmation Dialog
interface EditDialogProps {
    isOpen: boolean;
    resumeTitle: string;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

const EditDialog: React.FC<EditDialogProps> = ({
    isOpen,
    resumeTitle,
    onClose,
    onConfirm,
    isLoading = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center">
            <div className="w-full max-w-md rounded-lg shadow-xl bg-white dark:bg-gray-800 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Load Saved Resume
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <IconX size={20} />
                    </button>
                </div>

                <div className="flex items-start mb-4">
                    <IconAlertCircle size={24} className="text-amber-500 mr-2 mt-0.5" />
                    <p className="text-gray-600 dark:text-gray-300">
                        Loading <strong>"{resumeTitle}"</strong> will overwrite your current resume content. Are you sure you want to continue?
                    </p>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Load Resume'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Edit Title Dialog
interface EditTitleDialogProps {
    isOpen: boolean;
    resume: Resume | null;
    onClose: () => void;
    onConfirm: (newTitle: string) => void;
    isLoading?: boolean;
}

const EditTitleDialog: React.FC<EditTitleDialogProps> = ({
    isOpen,
    resume,
    onClose,
    onConfirm,
    isLoading = false
}) => {
    const [newTitle, setNewTitle] = useState(resume?.title || '');

    useEffect(() => {
        if (resume) {
            setNewTitle(resume.title);
        }
    }, [resume]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center">
            <div className="w-full max-w-md rounded-lg shadow-xl bg-white dark:bg-gray-800 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Edit Resume Title
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <IconX size={20} />
                    </button>
                </div>

                <div className="mb-4">
                    <label htmlFor="resume-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="resume-title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(newTitle)}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        disabled={isLoading || !newTitle.trim()}
                    >
                        {isLoading ? 'Saving...' : 'Save Title'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Saved = () => {
    const { user, loading } = useAuth();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingResume, setIsLoadingResume] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
    const [resumeToEdit, setResumeToEdit] = useState<Resume | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showEditTitleDialog, setShowEditTitleDialog] = useState(false);
    const [resumeToEditTitle, setResumeToEditTitle] = useState<Resume | null>(null);
    const [isSavingTitle, setIsSavingTitle] = useState(false);
    const router = useRouter();

    // Open the edit confirmation dialog
    const handleOpenEditDialog = (resume: Resume) => {
        setResumeToEdit(resume);
        setShowEditDialog(true);
    };

    // Load resume content into app state
    const handleLoadResume = async () => {
        if (!resumeToEdit) return;
        
        setIsLoadingResume(true);
        try {
            // Fetch the complete resume (just to make sure we have the latest data)
            const resumeData = await resumeService.getResume(resumeToEdit.id);
            if (!resumeData) {
                throw new Error("Resume not found");
            }
            
            // Convert to app state format
            const appState = mapResumeContentToAppState(resumeData);
            
            // Store in localStorage to be loaded by the editor
            localStorage.setItem('resumeEditorData', JSON.stringify({
                currentState: appState,
                savedAt: new Date().toISOString(),
                resumeId: resumeData.id
            }));
            
            // Navigate to the editor page
            router.push('/editor');
            
        } catch (err) {
            console.error("Error loading resume:", err);
            setError("Failed to load resume");
        } finally {
            setIsLoadingResume(false);
            setShowEditDialog(false);
        }
    };

    // Open delete confirmation dialog
    const handleOpenDeleteDialog = (resume: Resume) => {
        setResumeToDelete(resume);
        setShowDeleteDialog(true);
    };

    // Delete the resume
    const handleDeleteResume = async () => {
        if (!resumeToDelete) return;

        setIsDeleting(true);
        try {
            await resumeService.deleteResume(resumeToDelete.id);
            // Update local state after successful deletion
            setResumes(resumes.filter(r => r.id !== resumeToDelete.id));
            setShowDeleteDialog(false);
            setResumeToDelete(null);
        } catch (err) {
            console.error("Error deleting resume:", err);
            setError("Failed to delete resume");
        } finally {
            setIsDeleting(false);
        }
    };

    // Open the edit title dialog
    const handleOpenEditTitleDialog = (resume: Resume) => {
        setResumeToEditTitle(resume);
        setShowEditTitleDialog(true);
    };

    // Save the edited title
    const handleSaveTitle = async (newTitle: string) => {
        if (!resumeToEditTitle) return;
        
        setIsSavingTitle(true);
        try {
            await resumeService.updateResumeTitle(resumeToEditTitle.id, newTitle);
            
            // Update local state after successful update
            setResumes(resumes.map(r => 
                r.id === resumeToEditTitle.id 
                    ? { ...r, title: newTitle } 
                    : r
            ));
            
            setShowEditTitleDialog(false);
            setResumeToEditTitle(null);
        } catch (err) {
            console.error("Error updating resume title:", err);
            setError("Failed to update resume title");
        } finally {
            setIsSavingTitle(false);
        }
    };

    // Fetch resumes using resumeService
    useEffect(() => {
        if (!user && !loading) {
            setIsLoading(false);
            return;
        }

        const fetchResumes = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (!user?.uid) {
                    setError("User not authenticated");
                    setIsLoading(false);
                    return;
                }
                
                const userResumes = await resumeService.getUserResumes(user.uid);
                // Sort by last modified date (newest first)
                userResumes.sort((a, b) => {
                    return b.updatedAt.toMillis() - a.updatedAt.toMillis();
                });
                setResumes(userResumes);
            } catch (err) {
                console.error("Error fetching resumes:", err);
                setError("Failed to load your resumes");
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchResumes();
        }
    }, [user, loading]);

    return (
        <div className="min-h-screen bg-[var(--background)] p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[var(--foreground)]">All Projects</h1>
                    <p className="text-sm text-[var(--foreground)] opacity-70">Continue working on your previous resumes</p>
                </div>
                
                {isLoading ? (
                    <div className="text-center py-10">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                        <p className="mt-2 text-[var(--foreground)] opacity-70">Loading your resumes...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-10">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-[var(--foreground)] border-opacity-10 rounded-lg">
                        <p className="text-[var(--foreground)] opacity-70 mb-4">You don't have any saved resumes yet</p>
                        <button 
                            onClick={() => router.push('/editor')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                        >
                            Create Your First Resume
                        </button>
                    </div>
                ) : (
                <div className="bg-[var(--background)] border border-[var(--foreground)] border-opacity-10 rounded-lg">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--foreground)] border-opacity-10">
                                <th className="px-6 py-3 text-left">
                                    <span className="text-sm font-medium text-[var(--foreground)]">Title</span>
                                </th>
                                <th className="px-6 py-3 text-left">
                                    <span className="text-sm font-medium text-[var(--foreground)]">Owner</span>
                                </th>
                                <th className="px-6 py-3 text-left">
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-medium text-[var(--foreground)]">Last Modified</span>
                                        <IconChevronDown size={16} className="text-[var(--foreground)] opacity-50" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-right">
                                    <span className="text-sm font-medium text-[var(--foreground)]">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {resumes.map((resume) => (
                                <tr 
                                    key={resume.id}
                                    className="border-b border-[var(--foreground)] border-opacity-10 hover:bg-neutral-500/5"
                                >
                                    <td className="px-6 py-4">
                                        <span 
                                            className="text-sm text-[var(--foreground)] cursor-pointer hover:text-blue-500"
                                            onClick={() => handleOpenEditTitleDialog(resume)}
                                        >
                                            {resume.title}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-[var(--foreground)]">You</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-[var(--foreground)]">
                                            {formatDate(resume.updatedAt)} by You
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex space-x-2 justify-end">
                                            <button 
                                                onClick={() => handleOpenEditTitleDialog(resume)}
                                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-[var(--foreground)]"
                                                title="Edit Resume Title"
                                            >
                                                <IconEdit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleOpenEditDialog(resume)}
                                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-500"
                                                title="Load Resume"
                                            >
                                                <IconArrowRight size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleOpenDeleteDialog(resume)}
                                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500"
                                                title="Delete Resume"
                                            >
                                                <IconTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                isOpen={showDeleteDialog}
                resumeTitle={resumeToDelete?.title || ''}
                onClose={() => {
                    setShowDeleteDialog(false);
                    setResumeToDelete(null);
                }}
                onConfirm={handleDeleteResume}
                isDeleting={isDeleting}
            />

            {/* Edit Title Dialog */}
            <EditTitleDialog
                isOpen={showEditTitleDialog}
                resume={resumeToEditTitle}
                onClose={() => {
                    setShowEditTitleDialog(false);
                    setResumeToEditTitle(null);
                }}
                onConfirm={handleSaveTitle}
                isLoading={isSavingTitle}
            />

            {/* Edit Confirmation Dialog */}
            <EditDialog
                isOpen={showEditDialog}
                resumeTitle={resumeToEdit?.title || ''}
                onClose={() => {
                    setShowEditDialog(false);
                    setResumeToEdit(null);
                }}
                onConfirm={handleLoadResume}
                isLoading={isLoadingResume}
            />
        </div>
    );
};

export default Saved;