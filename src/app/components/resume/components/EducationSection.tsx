import React from 'react';
import styles from '@/app/resume.module.css';
import EditableText from './EditableText';
import SectionHeader from './SectionHeader';
import DeleteSectionButton from './DeleteSectionButton';

interface Education {
  id: string;
  school: string;
  degree: string;
  location: string;
  dates: string;
  category: string;
  skills: string;
}

interface EducationSectionProps {
  educations: Education[];
  sectionTitle: string;
  updateSectionTitle: (value: string) => void;
  updateEducation: (index: number, field: string, value: string) => void;
  onAddNew?: () => void;
  deleteSection: (id: string) => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({ 
  educations, 
  sectionTitle,
  updateSectionTitle,
  updateEducation,
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
            sectionId={education.id}
          />
          <div className={styles.resumeItemHeader}>
            <EditableText
              value={education.school}
              onChange={(value) => updateEducation(eduIndex, 'school', value)}
              className={styles.resumeItemTitle}
              placeholder="Name of institution"
              showAIModify={false}
            />
            <EditableText
              value={education.dates}
              onChange={(value) => updateEducation(eduIndex, 'dates', value)}
              className={styles.resumeItemLocation}
              inline={true}
              placeholder="Enter a date"
              showAIModify={false}
            />
          </div>
          <div className={styles.resumeItemSubheader}>
            <EditableText
              value={education.degree}
              onChange={(value) => updateEducation(eduIndex, 'degree', value)}
              className={styles.resumeItemOrg}
              placeholder="Degree"
              showAIModify={false}
            />
            <EditableText
              value={education.location}
              onChange={(value) => updateEducation(eduIndex, 'location', value)}
              className={styles.resumeItemDate}
              inline={true}
              placeholder="Location"
              showAIModify={false}
            />
          </div>
          <div className={styles.skillRow}>
            <EditableText
              value={education.category}
              onChange={(value) => updateEducation(eduIndex, 'category', value)}
              className={styles.resumeSkillsCategory}
              placeholder="Category"
              inline={true}
              showAIModify={false}
            />
            <span>: </span>
            <EditableText
              value={education.skills}
              onChange={(value) => updateEducation(eduIndex, 'skills', value)}
              className={styles.resumeSkillsList}
              placeholder="Key skills"
              inline={true}
              showAIModify={false}
            />
          </div>
        </div>
      ))}
    </section>
  );
};

export default EducationSection; 