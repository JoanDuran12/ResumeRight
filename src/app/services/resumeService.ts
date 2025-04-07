import { db } from "../firebase/config";
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
  Timestamp,
} from "firebase/firestore";
import { auth } from "../firebase/config";

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
    date: string;
    category?: string;
    skills?: string;
  }>;

  experience: Array<{
    id: string;
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: Array<{
      id: string;
      text: string;
    }>;
  }>;

  projects: Array<{
    id: string;
    name: string;
    tech: string;
    dates: string;
    bullets: Array<{
      id: string;
      text: string;
    }>;
  }>;

  skills: Array<{
    id: string;
    category: string;
    skills: string;
  }>;

  sectionTitles: {
    educationTitle: string;
    experienceTitle: string;
    projectsTitle: string;
    additionalTitle: string;
  };
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
  // Get current user ID with error handling
  private getCurrentUserId(): string {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User must be authenticated to perform this action");
    }
    return user.uid;
  }

  // Create a new resume
  async createResume(
    title: string,
    templateId: string,
    initialContent: ResumeContent
  ): Promise<string> {
    const userId = this.getCurrentUserId();
    const resumeData = {
      title,
      userId,
      templateId,
      content: initialContent,
      latexContent: "", // Will be generated when needed
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "resumes"), resumeData);
    return docRef.id;
  }

  // Save/Update resume content
  async saveResume(
    resumeId: string | null,
    title: string,
    content: ResumeContent
  ): Promise<string> {
    const userId = this.getCurrentUserId();
    
    if (resumeId) {
      try {
        // Check if the document exists first
        const docRef = doc(db, "resumes", resumeId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          // Update existing resume
          await updateDoc(docRef, {
            title,
            content,
            updatedAt: Timestamp.now(),
          });
          return resumeId;
        } else {
          // Document with this ID doesn't exist, create a new one
          console.log(`Resume with ID ${resumeId} doesn't exist. Creating new resume.`);
          return this.createResume(title, "default", content);
        }
      } catch (error) {
        console.error("Error checking document existence:", error);
        // Fallback to creating a new document
        return this.createResume(title, "default", content);
      }
    } else {
      // Create new resume
      return this.createResume(title, "default", content);
    }
  }

  // Get a resume by ID
  async getResume(resumeId: string): Promise<Resume | null> {
    const docRef = doc(db, "resumes", resumeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Resume;
    }
    return null;
  }

  // Get all resumes for a user
  async getUserResumes(userId: string): Promise<Resume[]> {
    const q = query(collection(db, "resumes"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Resume[];
  }

  // Update resume content
  async updateResumeContent(
    resumeId: string,
    content: Partial<ResumeContent>
  ): Promise<void> {
    const docRef = doc(db, "resumes", resumeId);
    await updateDoc(docRef, {
      content,
      updatedAt: Timestamp.now(),
    });
  }

  // Update LaTeX content
  async updateLatexContent(
    resumeId: string,
    latexContent: string
  ): Promise<void> {
    const docRef = doc(db, "resumes", resumeId);
    await updateDoc(docRef, {
      latexContent,
      updatedAt: Timestamp.now(),
    });
  }

  // Delete a resume
  async deleteResume(resumeId: string): Promise<void> {
    const docRef = doc(db, "resumes", resumeId);
    await deleteDoc(docRef);
  }

  // Update resume title
  async updateResumeTitle(resumeId: string, title: string): Promise<void> {
    const docRef = doc(db, "resumes", resumeId);
    await updateDoc(docRef, {
      title,
      updatedAt: Timestamp.now(),
    });
  }
}

export const resumeService = new ResumeService();
