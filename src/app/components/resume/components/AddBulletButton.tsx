import React from 'react';
import styles from '@/app/resume.module.css';

interface AddBulletButtonProps {
  onClick: () => void;
}

const AddBulletButton: React.FC<AddBulletButtonProps> = ({ onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent event bubbling which could cause issues
    e.stopPropagation();
    e.preventDefault();
    
    console.log("[AddBulletButton] Add bullet button clicked");
    onClick();
  };

  return (
    <button 
      className={styles.addBulletButton}
      onClick={handleClick}
      aria-label="Add new bullet point"
    >
      +
    </button>
  );
};

export default AddBulletButton; 