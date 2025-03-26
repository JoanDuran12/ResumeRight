import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  Timestamp 
} from 'firebase/firestore';

// Types
export interface ResumeContent {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    website?: string;
    linkedin: string;
    github: string;
    citizenship?: string;
  };
  
  education: Array<{
    id: string;
    school: string;
    degree: string;
    location: string;
    startDate?: string;
    graduationDate: string;
    relevantCoursework?: string[];
  }>;
  
  experience: Array<{
    id: string;
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }>;
  
  projects: Array<{
    id: string;
    name: string;
    technologies: string[];
    highlights: string[];
  }>;
  
  technicalSkills: Array<{
    id: string;
    category: string;
    skills: string[];
  }>;
}

export interface Resume {
  id: string;
  userId: string;
  templateId: string;
  title: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  content: ResumeContent;
  latexContent: string;
}

class ResumeService {
  // Create a new resume
  async createResume(userId: string, title: string, templateId: string, initialContent: ResumeContent): Promise<string> {
    const resumeData = {
      title,
      userId,
      templateId,
      content: initialContent,
      latexContent: '', // Will be generated when needed
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'resumes'), resumeData);
    return docRef.id;
  }

  // Get a resume by ID
  async getResume(resumeId: string): Promise<Resume | null> {
    const docRef = doc(db, 'resumes', resumeId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Resume;
    }
    return null;
  }

  // Get all resumes for a user
  async getUserResumes(userId: string): Promise<Resume[]> {
    const q = query(collection(db, 'resumes'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as Resume[];
  }

  // Update resume content
  async updateResumeContent(resumeId: string, content: Partial<ResumeContent>): Promise<void> {
    const docRef = doc(db, 'resumes', resumeId);
    await updateDoc(docRef, {
      content,
      updatedAt: Timestamp.now()
    });
  }

  // Update LaTeX content
  async updateLatexContent(resumeId: string, latexContent: string): Promise<void> {
    const docRef = doc(db, 'resumes', resumeId);
    await updateDoc(docRef, {
      latexContent,
      updatedAt: Timestamp.now()
    });
  }

  // Delete a resume
  async deleteResume(resumeId: string): Promise<void> {
    const docRef = doc(db, 'resumes', resumeId);
    await deleteDoc(docRef);
  }
}

export const resumeService = new ResumeService(); 