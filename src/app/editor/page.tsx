"use client";

import Header from "../components/Header";
import ResumeEditor from "@/app/components/resume/ResumeEditor";
import JobDescription from "../components/resume/JobDescription";

export default function EditorPage() {
  return (
    <>
      <Header />
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
