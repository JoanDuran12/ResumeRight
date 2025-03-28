import React from 'react';
import styles from '@/app/resume.module.css';
import EditableText from './EditableText';
import SectionHeader from './SectionHeader';
import EditableBulletItem from './EditableBulletItem';
import DeleteSectionButton from './DeleteSectionButton';
import AddBulletButton from './AddBulletButton';

interface Education {
  id: string;
  school: string;
  degree: string;
  location: string;
  dates: string;
  bullets: string[];
}

interface EducationSectionProps {
  educations: Education[];
  sectionTitle: string;
  updateSectionTitle: (value: string) => void;
  updateEducation: (index: number, field: string, value: string) => void;
  updateEducationBullet: (eduIndex: number, bulletIndex: number, value: string) => void;
  deleteEducationBullet: (eduIndex: number, bulletIndex: number) => void;
  addEducationBullet: (eduIndex: number) => void;
  onAddNew?: () => void;
  deleteSection: (id: string) => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({ 
  educations, 
  sectionTitle,
  updateSectionTitle,
  updateEducation, 
  updateEducationBullet, 
  deleteEducationBullet, 
  addEducationBullet,
  onAddNew,
  deleteSection
}) => {
  return (
    <section className={styles.resumeSection}>
      <SectionHeader 
        title={sectionTitle} 
        onAddNew={onAddNew} 
        onTitleChange={updateSectionTitle}
        placeholder="Education"
      />
      {educations.map((education, eduIndex) => (
        <div key={eduIndex} className={styles.resumeItem}>
          <DeleteSectionButton 
            onClick={() => deleteSection(education.id)} 
            label="Delete education entry"
          />
          <div className={styles.resumeItemHeader}>
            <div className={styles.titleWithButton}>
              <EditableText
                value={education.school}
                onChange={(value) => updateEducation(eduIndex, 'school', value)}
                className={styles.resumeItemTitle}
                placeholder="Name of institution"
              />
              <AddBulletButton onClick={() => addEducationBullet(eduIndex)} />
            </div>
            <EditableText
              value={education.location}
              onChange={(value) => updateEducation(eduIndex, 'location', value)}
              className={styles.resumeItemLocation}
              inline={true}
              placeholder="Location"
            />
          </div>
          <div className={styles.resumeItemSubheader}>
            <EditableText
              value={education.degree}
              onChange={(value) => updateEducation(eduIndex, 'degree', value)}
              className={styles.resumeItemOrg}
              placeholder="Degree"
            />
            <EditableText
              value={education.dates}
              onChange={(value) => updateEducation(eduIndex, 'dates', value)}
              className={styles.resumeItemDate}
              inline={true}
              placeholder="Select a date range"
            />
          </div>
          <ul className={styles.resumeBullets}>
            {education.bullets.map((bullet, bulletIndex) => (
              <EditableBulletItem
                key={bulletIndex}
                value={bullet}
                onChange={(value) => updateEducationBullet(eduIndex, bulletIndex, value)}
                onDelete={() => deleteEducationBullet(eduIndex, bulletIndex)}
                placeholder="Write an accomplishment"
              />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default EducationSection; 