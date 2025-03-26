import React from 'react';
import styles from '@/app/resume.module.css';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <h2 className={styles.resumeSectionTitle}>{title}</h2>
  );
};

export default SectionHeader; 