import React from 'react';
import styles from '@/app/resume.module.css';
import EditableText from './EditableText';
import EditableBulletItem from './EditableBulletItem';
import AddBulletButton from './AddBulletButton';
import SectionHeader from './SectionHeader';

interface Experience {
  title: string;
  location: string;
  organization: string;
  dates: string;
  bullets: string[];
}

interface ExperienceSectionProps {
  experience: Experience[];
  updateExperience: (index: number, field: string, value: string) => void;
  updateExperienceBullet: (expIndex: number, bulletIndex: number, value: string) => void;
  deleteExperienceBullet: (expIndex: number, bulletIndex: number) => void;
  addExperienceBullet: (expIndex: number) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ 
  experience, 
  updateExperience, 
  updateExperienceBullet, 
  deleteExperienceBullet, 
  addExperienceBullet 
}) => {
  return (
    <section className={styles.resumeSection}>
      <SectionHeader title="Experience" />
      {experience.map((exp, expIndex) => (
        <div key={expIndex} className={styles.resumeItem}>
          <div className={styles.resumeItemHeader}>
            <div className={styles.resumeItemTitle}>
              <EditableText 
                value={exp.title} 
                onChange={(value) => updateExperience(expIndex, 'title', value)} 
                className={styles.resumeItemTitle}
              />
            </div>
            <div className={styles.resumeItemLocation}>
              <EditableText 
                value={exp.location} 
                onChange={(value) => updateExperience(expIndex, 'location', value)} 
                className={styles.resumeItemLocation}
                inline={true}
              />
            </div>
          </div>
          <div className={styles.resumeItemSubheader}>
            <div className={styles.resumeItemOrg}>
              <EditableText 
                value={exp.organization} 
                onChange={(value) => updateExperience(expIndex, 'organization', value)} 
                className={styles.resumeItemOrg}
              />
            </div>
            <div className={styles.resumeItemDate}>
              <EditableText 
                value={exp.dates} 
                onChange={(value) => updateExperience(expIndex, 'dates', value)} 
                className={styles.resumeItemDate}
                inline={true}
              />
            </div>
          </div>
          <ul className={styles.resumeBullets}>
            {exp.bullets.map((bullet, bulletIndex) => (
              <EditableBulletItem 
                key={bulletIndex}
                value={bullet}
                onChange={(value) => updateExperienceBullet(expIndex, bulletIndex, value)}
                onDelete={() => deleteExperienceBullet(expIndex, bulletIndex)}
              />
            ))}
            <AddBulletButton onClick={() => addExperienceBullet(expIndex)} />
          </ul>
        </div>
      ))}
    </section>
  );
};

export default ExperienceSection; 