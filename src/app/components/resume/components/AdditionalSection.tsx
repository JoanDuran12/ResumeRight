import React from 'react';
import styles from '@/app/resume.module.css';
import EditableText from './EditableText';

interface Skill {
  id: string;
  category: string;
  skills: string;
}

interface AdditionalSectionProps {
  sectionTitle: string;
  updateSectionTitle: (value: string) => void;
  skills: Skill[];
  updateSkill: (index: number, field: string, value: string) => void;
  addSkillCategory: () => void;
  deleteSection: (id: string) => void;
}

const AdditionalSection: React.FC<AdditionalSectionProps> = ({
  sectionTitle,
  updateSectionTitle,
  skills,
  updateSkill,
  addSkillCategory,
  deleteSection
}) => {
  return (
    <div className={styles.resumeSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.resumeSectionTitle}>
          <EditableText
            value={sectionTitle}
            onChange={updateSectionTitle}
            className={styles.resumeSectionTitle}
            placeholder="Additional"
            inline={true}
          />
        </h2>
        <button 
          className={styles.addNewButton}
          onClick={addSkillCategory}
          aria-label="Add new skill category"
        >
          + Add New
        </button>
      </div>
      <div className={styles.resumeItem}>
        {skills.map((skill, index) => (
          <div key={skill.id} className={styles.skillRow}>
            <button 
              className={styles.deleteButton}
              onClick={() => deleteSection(skill.id)}
              aria-label="Delete skill category"
            >
              ×
            </button>
            <div>
              <EditableText
                value={skill.category}
                onChange={(value) => updateSkill(index, 'category', value)}
                className={styles.resumeSkillsCategory}
                placeholder="Category"
                inline={true}
              />
              <span>: </span>
              <EditableText
                value={skill.skills}
                onChange={(value) => updateSkill(index, 'skills', value)}
                className={styles.resumeSkillsList}
                placeholder="Key skills"
                inline={true}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdditionalSection; 