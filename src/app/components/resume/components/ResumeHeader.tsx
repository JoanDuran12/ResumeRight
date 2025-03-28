import React from 'react';
import styles from '@/app/resume.module.css';
import EditableText from './EditableText';

interface ContactInfo {
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  github: string;
}

interface ResumeHeaderProps {
  name: string;
  contact: ContactInfo;
  setName: (value: string) => void;
  updateContact: (field: string, value: string) => void;
}

const ResumeHeader: React.FC<ResumeHeaderProps> = ({
  name,
  contact,
  setName,
  updateContact
}) => {
  return (
    <div className={styles.resumeHeader}>
      <h1 className={styles.resumeName}>
        <EditableText
          value={name}
          onChange={setName}
          className={styles.resumeName}
          placeholder="Your Name"
        />
      </h1>
      <div className={`${styles.resumeContact} flex justify-center items-center gap-2`}>
        <EditableText
          value={contact.phone}
          onChange={(value) => updateContact('phone', value)}
          inline={true}
          placeholder="123-456-7890"
        />
        <span className={styles.separator}>|</span>
        <div className={styles.contactItem}>
          <EditableText
            value={contact.email}
            onChange={(value) => updateContact('email', value)}
            inline={true}
            placeholder="youremail@gmail.com"
          />
        </div>
        <span className={styles.separator}>|</span>
        <div className={styles.contactItem}>
          <EditableText
            value={contact.website}
            onChange={(value) => updateContact('website', value)}
            inline={true}
            placeholder="yourwebsite.com"
          />
        </div>
        <span className={styles.separator}>|</span>
        <div className={styles.contactItem}>
          <span className={styles.contactPrefix}>linkedin.com/in/</span>
          <EditableText
            value={contact.linkedin}
            onChange={(value) => updateContact('linkedin', value)}
            inline={true}
            placeholder="username"
          />
        </div>
        <span className={styles.separator}>|</span>
        <div className={styles.contactItem}>
          <span className={styles.contactPrefix}>github.com/</span>
          <EditableText
            value={contact.github}
            onChange={(value) => updateContact('github', value)}
            inline={true}
            placeholder="username"
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeHeader; 