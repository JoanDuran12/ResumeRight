"use client";

import EditorHeader from "../components/resume/editorHeader";
import ResumeEditor from "../components/resume/ResumeEditor";
import JobDescription from "../components/resume/JobDescription";

export default function EditorPage() {
  return (
    <>
      <EditorHeader />
      <div>
        <JobDescription />
      </div>
      <div className="flex justify-center py-8 px-4 gap-x-4 bg-slate-100">
        <div className="bg-white shadow-md">
          <ResumeEditor />
        </div>
      </div>
    </>
  );
}
