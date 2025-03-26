'use client';

import { IconChevronDown } from '@tabler/icons-react';
import { useAuth } from "@/app/contexts/AuthContext";
import { db } from '../firebase/config';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';

interface SavedResume {
    id: string;
    title: string;
    updatedAt: Timestamp;
    templateId: string;
    latexContent: string;
    createdAt: Timestamp;
    userId: string;
}
const formatDate = (date: Timestamp) => {
    const dateObject = date.toDate();
    
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

const Saved = () => {
    const { user, loading } = useAuth();
    const [ data, setData ] = useState<SavedResume[]>([]);

    useEffect(() => {
        if (!user && !loading) {
            return;
        }

        const updatedData: SavedResume[] = [];
        const showData = async () => {
            try {
                const q = query(
                    collection(db, "resumes"), 
                    where("userId", "==", user?.uid), 
                    // orderBy("updatedAt", "desc")
                ); 
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    updatedData.push({
                        id: doc.id,
                        title: doc.get("title"),
                        updatedAt: doc.get("updatedAt"),
                        templateId: doc.get("templatedId"),
                        latexContent: doc.get("latexContent"),
                        createdAt: doc.get("createdAt"),
                        userId: doc.get("userId")
                    } as SavedResume)
                });

                setData(updatedData);
            } catch (err) {
                console.log("Error")
            }
        }

        showData();
    }, [user, loading]);

    return (
        <div className="min-h-screen bg-[var(--background)] p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[var(--foreground)]">All Projects</h1>
                    <p className="text-sm text-[var(--foreground)] opacity-70">Continue working on your previous resumes</p>
                </div>
                <div className="bg-[var(--background)] border border-[var(--foreground)] border-opacity-10 rounded-lg">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--foreground)] border-opacity-10">
                                <th className="px-6 py-3 text-left">
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-[var(--foreground)] border-opacity-30"
                                        />
                                        <span className="text-sm font-medium text-[var(--foreground)]">Title</span>
                                    </div>
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
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((resume) => (
                                <tr 
                                    key={resume.id}
                                    className="border-b border-[var(--foreground)] border-opacity-10 hover:bg-neutral-500/5"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-[var(--foreground)] border-opacity-30"
                                            />
                                            <span className="text-sm text-[var(--foreground)]">{resume.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-[var(--foreground)]">You</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-[var(--foreground)]">
                                            {formatDate(resume.updatedAt)} by You
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Saved;