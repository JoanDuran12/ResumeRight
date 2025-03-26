import React from 'react';
import styles from '@/app/resume.module.css';
import EditableText from './EditableText';

interface Contact {
  phone: string;
  email: string;
  linkedin: string;
  github: string;
}

interface ResumeHeaderProps {
  name: string;
  contact: Contact;
  setName: (name: string) => void;
  updateContact: (field: string, value: string) => void;
}

const ResumeHeader: React.FC<ResumeHeaderProps> = ({ name, contact, setName, updateContact }) => {
  return (
    <header className={styles.resumeHeader}>
      <h1 className={styles.resumeName}>
        <EditableText value={name} onChange={setName} className={styles.resumeName} />
      </h1>
      <div className={styles.resumeContact}>
        <EditableText 
          value={contact.phone} 
          onChange={(value) => updateContact('phone', value)} 
          inline={true}
        /> | <a href={`mailto:${contact.email}`}>
          <EditableText 
            value={contact.email} 
            onChange={(value) => updateContact('email', value)} 
            inline={true}
          />
        </a> | <a href={`https://${contact.linkedin}`}>
          <EditableText 
            value={contact.linkedin} 
            onChange={(value) => updateContact('linkedin', value)} 
            inline={true}
          />
        </a> | <a href={`https://${contact.github}`}>
          <EditableText 
            value={contact.github} 
            onChange={(value) => updateContact('github', value)} 
            inline={true}
          />
        </a>
      </div>
    </header>
  );
};

export default ResumeHeader; 