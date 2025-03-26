'use client'

import Header from "../components/Header";
import ResumeEditor from "../components/resume/ResumeEditor";

export default function EditorPage() {
    return (
        <>
            <Header />
            <div className="flex justify-center py-8 px-4">
                <div className="bg-white shadow-md">
                    <ResumeEditor />
                </div>
            </div>
        </>
    );
}