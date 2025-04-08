import React from 'react';
import styles from '@/app/resume.module.css';

interface DeleteSectionButtonProps {
  onClick: () => void;
  label: string;
  sectionId?: string; // Optional ID for debugging
}

const DeleteSectionButton: React.FC<DeleteSectionButtonProps> = ({ onClick, label, sectionId }) => {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent event bubbling which could cause issues
    e.stopPropagation();
    e.preventDefault();
    
    console.log(`[DeleteSectionButton] Clicked to delete section with ID: ${sectionId || 'unknown'}`);
    onClick();
  };

  return (
    <button 
      className={styles.deleteButton}
      onClick={handleClick}
      aria-label={label}
      data-section-id={sectionId} // For debugging in DOM
    >
      ×
    </button>
  );
};

export default DeleteSectionButton; 