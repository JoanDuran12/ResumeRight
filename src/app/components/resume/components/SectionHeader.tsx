import React from 'react';
import styles from '@/app/resume.module.css';
import EditableText from './EditableText';

interface SectionHeaderProps {
  title: string;
  onAddNew?: () => void;
  onTitleChange?: (value: string) => void;
  placeholder?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  onAddNew, 
  onTitleChange,
  placeholder = 'Section Title'
}) => {
  return (
    <div className={styles.sectionHeader}>
      <h2 className={styles.resumeSectionTitle}>
        {onTitleChange ? (
          <EditableText
            value={title}
            onChange={onTitleChange}
            className={styles.resumeSectionTitle}
            placeholder={placeholder}
            inline={true}
          />
        ) : (
          title
        )}
      </h2>
      {onAddNew && (
        <button 
          className={styles.addNewButton}
          onClick={onAddNew}
          aria-label={`Add new ${title.toLowerCase()} entry`}
        >
          + Add New
        </button>
      )}
    </div>
  );
};

export default SectionHeader; 