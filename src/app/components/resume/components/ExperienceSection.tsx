import React from 'react';
import styles from '@/app/resume.module.css';
import EditableText from './EditableText';
import SectionHeader from './SectionHeader';
import EditableBulletItem from './EditableBulletItem';
import DeleteSectionButton from './DeleteSectionButton';
import AddBulletButton from './AddBulletButton';

interface Experience {
  id: string;
  title: string;
  organization: string;
  location: string;
  dates: string;
  bullets: string[];
}

interface ExperienceSectionProps {
  experiences: Experience[];
  sectionTitle: string;
  updateSectionTitle: (value: string) => void;
  updateExperience: (index: number, field: string, value: string) => void;
  updateExperienceBullet: (expIndex: number, bulletIndex: number, value: string) => void;
  deleteExperienceBullet: (expIndex: number, bulletIndex: number) => void;
  addExperienceBullet: (expIndex: number) => void;
  onAddNew?: () => void;
  deleteSection: (id: string) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ 
  experiences, 
  sectionTitle,
  updateSectionTitle,
  updateExperience, 
  updateExperienceBullet, 
  deleteExperienceBullet, 
  addExperienceBullet,
  onAddNew,
  deleteSection
}) => {
  return (
    <section className={styles.resumeSection}>
      <SectionHeader 
        title={sectionTitle} 
        onAddNew={onAddNew} 
        onTitleChange={updateSectionTitle}
        placeholder="Experience"
      />
      {experiences.map((experience, expIndex) => (
        <div key={expIndex} className={styles.resumeItem}>
          <DeleteSectionButton 
            onClick={() => deleteSection(experience.id)} 
            label="Delete experience entry"
            sectionId={experience.id}
          />
          <div className={styles.resumeItemHeader}>
            <div className={styles.titleWithButton}>
              <EditableText
                value={experience.title}
                onChange={(value) => updateExperience(expIndex, 'title', value)}
                className={styles.resumeItemTitle}
                placeholder="Job Position"
                showAIModify={false}
              />
              <AddBulletButton onClick={() => addExperienceBullet(expIndex)} />
            </div>
            <EditableText
              value={experience.dates}
              onChange={(value) => updateExperience(expIndex, 'dates', value)}
              className={styles.resumeItemDate}
              inline={true}
              placeholder="Enter a date"
              showAIModify={false}
            />
          </div>
          <div className={styles.resumeItemSubheader}>
            <EditableText
              value={experience.organization}
              onChange={(value) => updateExperience(expIndex, 'organization', value)}
              className={styles.resumeItemOrg}
              placeholder="Company Name"
              showAIModify={false}
            />
            <EditableText
              value={experience.location}
              onChange={(value) => updateExperience(expIndex, 'location', value)}
              className={styles.resumeItemLocation}
              inline={true}
              placeholder="Location"
              showAIModify={false}
            />
          </div>
          <ul className={styles.resumeBullets}>
            {experience.bullets.map((bullet, bulletIndex) => (
              <EditableBulletItem
                key={bulletIndex}
                value={bullet}
                onChange={(value) => updateExperienceBullet(expIndex, bulletIndex, value)}
                onDelete={() => deleteExperienceBullet(expIndex, bulletIndex)}
                placeholder="Write an accomplishment"
              />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default ExperienceSection; 