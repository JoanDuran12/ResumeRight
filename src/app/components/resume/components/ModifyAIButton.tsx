import React from "react";
import styles from "@/app/resume.module.css";
import { IconSparkles } from "@tabler/icons-react";

interface ModifyAIButtonPropsProps {
  onClick: () => void;
  label: string;
}

const ModifyAIButtonProps: React.FC<ModifyAIButtonPropsProps> = ({
  onClick,
  label,
}) => {
  return (
    <button
      className="opacity-0 hover:opacity-100 transition-opacity duration-200 ease-in-out"
      onClick={onClick}
      aria-label={label}
    >
      <IconSparkles stroke={2} className="text-yellow-700 size-6" />
    </button>
  );
};

export default ModifyAIButtonProps;
