import React from 'react';
import styles from '@/app/resume.module.css';
import EditableText from './EditableText';
import SectionHeader from './SectionHeader';

interface Education {
  school: string;
  location: string;
  degree: string;
  dates: string;
}

interface EducationSectionProps {
  education: Education[];
  updateEducation: (index: number, field: string, value: string) => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({ education, updateEducation }) => {
  return (
    <section className={styles.resumeSection}>
      <SectionHeader title="Education" />
      {education.map((edu, index) => (
        <div key={index} className={styles.resumeItem}>
          <div className={styles.resumeItemHeader}>
            <div className={styles.resumeItemTitle}>
              <EditableText 
                value={edu.school} 
                onChange={(value) => updateEducation(index, 'school', value)} 
                className={styles.resumeItemTitle}
              />
            </div>
            <div className={styles.resumeItemLocation}>
              <EditableText 
                value={edu.location} 
                onChange={(value) => updateEducation(index, 'location', value)} 
                className={styles.resumeItemLocation}
                inline={true}
              />
            </div>
          </div>
          <div className={styles.resumeItemSubheader}>
            <div className={styles.resumeItemOrg}>
              <EditableText 
                value={edu.degree} 
                onChange={(value) => updateEducation(index, 'degree', value)} 
                className={styles.resumeItemOrg}
              />
            </div>
            <div className={styles.resumeItemDate}>
              <EditableText 
                value={edu.dates} 
                onChange={(value) => updateEducation(index, 'dates', value)} 
                className={styles.resumeItemDate}
                inline={true}
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default EducationSection; 