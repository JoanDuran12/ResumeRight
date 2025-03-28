import {
  IconCircleArrowLeft,
  IconCircleArrowRight,
  IconCircleArrowLeftFilled,
  IconCircleArrowRightFilled,
} from "@tabler/icons-react";

import React, { useState } from "react";

function JobDescription() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [jobDescription, setJobDescription] = useState("");

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
      className={`fixed top-1/6 bg-white rounded-xl z-999 ${
        isExpanded ? "w-80 h-[480] px-4 left-[-8px]" : "w-24 left-[-36px]"
      } transition-all duration-300 border `}
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
          className="text-black hover:underline ml-auto"
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
            className="w-full h-full border border-black rounded-sm px-4 py-4 resize-none"
          />
        </div>
      )}
    </div>
  );
}

export default JobDescription;
