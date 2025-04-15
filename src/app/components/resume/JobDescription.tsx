import {
  IconCircleArrowLeft,
  IconCircleArrowRight,
  IconCircleArrowLeftFilled,
  IconCircleArrowRightFilled,
} from "@tabler/icons-react";

import React, { useState, useEffect } from "react";

function JobDescription() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [jobDescription, setJobDescription] = useState("");

  // Load job description from localStorage on initial render
  useEffect(() => {
    const savedJobDescription = localStorage.getItem("jobDescription");
    if (savedJobDescription) {
      setJobDescription(savedJobDescription);
    }
  }, []);

  // Save job description to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("jobDescription", jobDescription);
  }, [jobDescription]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJobDescription(e.target.value);
  };

  return (
    <div
      className={`fixed top-1/6 bg-[var(--background)] rounded-xl z-999 ${
        isExpanded ? "w-80 h-[480] px-4 left-[-8px]" : "w-24 left-[-36px]"
      } transition-all duration-300 border border-gray-200`}
    >
      <div className="flex p-4">
        <h2
          className={`text-lg underline font-bold ${
            isExpanded ? "block" : "hidden"
          }`}
        >
          Job Description
        </h2>
        <button
          onClick={toggleExpand}
          className="text-[var(--foreground)] hover:underline ml-auto"
          aria-label={
            isExpanded ? "Collapse job description" : "Expand job description"
          }
        >
          {isExpanded ? (
            <IconCircleArrowLeftFilled />
          ) : (
            <IconCircleArrowRightFilled />
          )}
        </button>
      </div>
      {isExpanded && (
        <div className="p-2 h-[390px]">
          <textarea
            value={jobDescription}
            onChange={handleDescriptionChange}
            placeholder="Enter the job description"
            className="w-full h-full border border-gray-300 rounded-sm px-4 py-4 resize-none bg-[var(--background)] text-[var(--foreground)]"
          />
        </div>
      )}
    </div>
  );
}

export default JobDescription;
