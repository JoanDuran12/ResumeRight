import React from 'react';
import styles from '@/app/resume.module.css';
import EditableText from './EditableText';
import SectionHeader from './SectionHeader';

interface Skills {
  languages: string;
  frameworks: string;
  tools: string;
  libraries: string;
}

interface SkillsSectionProps {
  skills: Skills;
  updateSkills: (field: string, value: string) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, updateSkills }) => {
  return (
    <section className={styles.resumeSection}>
      <SectionHeader title="Technical Skills" />
      <div className={styles.resumeSkills} style={{ alignItems: 'center'}}>
        <div className={styles.resumeSkillsCategory} style={{ marginRight: '0', minWidth: '120px', fontWeight: 'bold' }}>Languages: </div>
        <EditableText 
          value={skills.languages} 
          onChange={(value) => updateSkills('languages', value)} 
          className={styles.resumeSkillsList}
          inline={true}
          placeholder="JavaScript, Python, Java, etc."
        />
      </div>
      <div className={styles.resumeSkills} style={{alignItems: 'center'}}>
        <div className={styles.resumeSkillsCategory} style={{ marginRight: '0', minWidth: '120px', fontWeight: 'bold' }}>Frameworks: </div>
        <EditableText 
          value={skills.frameworks} 
          onChange={(value) => updateSkills('frameworks', value)} 
          className={styles.resumeSkillsList}
          inline={true}
          placeholder="React, Angular, Express, etc."
        />
      </div>
      <div className={styles.resumeSkills} style={{ alignItems: 'center'}}>
        <div className={styles.resumeSkillsCategory} style={{ marginRight: '0', minWidth: '120px', fontWeight: 'bold' }}>Developer Tools: </div>
        <EditableText 
          value={skills.tools} 
          onChange={(value) => updateSkills('tools', value)} 
          className={styles.resumeSkillsList}
          inline={true}
          placeholder="Git, Docker, AWS, etc."
        />
      </div>
      <div className={styles.resumeSkills} style={{ alignItems: 'center'}}>
        <div className={styles.resumeSkillsCategory} style={{ marginRight: '0', minWidth: '120px', fontWeight: 'bold' }}>Libraries: </div>
        <EditableText 
          value={skills.libraries} 
          onChange={(value) => updateSkills('libraries', value)} 
          className={styles.resumeSkillsList}
          inline={true}
          placeholder="Redux, jQuery, etc."
        />
      </div>
    </section>
  );
};

export default SkillsSection; 