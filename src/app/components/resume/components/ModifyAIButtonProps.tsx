import React from "react";
import styles from "@/app/resume.module.css";
import { IconSparkles, IconLoader2 } from "@tabler/icons-react";

interface ModifyAIButtonPropsProps {
  onClick: () => void;
  label: string;
  isLoading?: boolean;
}

const ModifyAIButtonProps: React.FC<ModifyAIButtonPropsProps> = ({
  onClick,
  label,
  isLoading = false,
}) => {
  return (
    <button
      className={`${styles.modifyAIButton} group`}
      onClick={onClick}
      aria-label={label}
      disabled={isLoading}
    >
      {isLoading ? (
        <IconLoader2
          stroke={2}
          className="text-purple-700 size-7 animate-spin"
        />
      ) : (
        <IconSparkles 
          stroke={2} 
          className="text-purple-700 size-7 transition-transform duration-200 ease-in-out hover:text-purple-500 hover:scale-110" 
        />
      )}
    </button>
  );
};

export default ModifyAIButtonProps;
