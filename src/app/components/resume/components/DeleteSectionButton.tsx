import React from 'react';
import styles from '@/app/resume.module.css';

interface DeleteSectionButtonProps {
  onClick: () => void;
  label: string;
}

const DeleteSectionButton: React.FC<DeleteSectionButtonProps> = ({ onClick, label }) => {
  return (
    <button 
      className={styles.deleteButton}
      onClick={onClick}
      aria-label={label}
    >
      ×
    </button>
  );
};

export default DeleteSectionButton; 