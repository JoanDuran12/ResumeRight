import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import styles from '@/app/resume.module.css';
import EditableText from '@/app/components/resume/components/EditableText';

interface EditableBulletItemProps {
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
  placeholder?: string;
}

const EditableBulletItem: React.FC<EditableBulletItemProps> = ({
  value,
  onChange,
  onDelete,
  placeholder = 'Write an accomplishment'
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isLongContent, setIsLongContent] = useState(false);
  
  // Check if content is long enough to warrant multiline
  useEffect(() => {
    setIsLongContent(value.length > 150); // Increased threshold to match 720px width
  }, [value]);
  
  // Function to handle input and prevent line breaks
  const handleChange = (newValue: string) => {
    // Only replace newlines if not in long content mode
    if (!isLongContent) {
      // Replace any newline characters with spaces
      const singleLineValue = newValue.replace(/\n/g, ' ');
      onChange(singleLineValue);
    } else {
      onChange(newValue);
    }
  };
  
  return (
    <li
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
      className={styles.resumeBulletItem}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <div className={styles.bulletContainer} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <span
            className={`${styles.bulletPoint} ${isHovering ? styles.deleteBullet : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={{ lineHeight: 'normal', display: 'flex', alignItems: 'center' }}
          >
            {isHovering ? '×' : '•'}
          </span>
        </div>
        <div className={styles.bulletContent} style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center',
          maxWidth: 'calc(100% - 30px)', // Leave space for bullet
          width: '100%'  
        }}>
          <EditableText
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            multiline={false}
            inline={true}
            className={styles.bulletContent}
          />
        </div>
      </div>
    </li>
  );
};

export default EditableBulletItem;