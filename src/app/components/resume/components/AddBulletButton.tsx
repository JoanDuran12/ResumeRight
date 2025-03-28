import React from 'react';
import styles from '@/app/resume.module.css';

interface AddBulletButtonProps {
  onClick: () => void;
}

const AddBulletButton: React.FC<AddBulletButtonProps> = ({ onClick }) => {
  return (
    <button 
      className={styles.addBulletButton}
      onClick={onClick}
      aria-label="Add new bullet point"
    >
      +
    </button>
  );
};

export default AddBulletButton; 