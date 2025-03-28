import React, { useState, useRef, useEffect } from 'react';
import styles from '@/app/resume.module.css';

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
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const contentRef = useRef<HTMLSpanElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  const handleClick = () => {
    setIsEditing(true);
    // Focus will happen automatically on the textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(localValue.length, localValue.length);
      }
    }, 10);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
  };
  
  const saveChanges = () => {
    setIsEditing(false);
    onChange(localValue);
  };
  
  const handleBlur = () => {
    saveChanges();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveChanges();
    }
    
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsEditing(false);
      setLocalValue(value); // Reset to original value
    }
  };
  
  // Configure textarea height to match content
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing, localValue]);
  
  return (
    <li
      className={styles.resumeBulletItem}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={styles.bulletContainer}>
        <span 
          className={`${styles.bulletPoint} ${isHovering ? styles.deleteBullet : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          {isHovering ? '×' : '•'}
        </span>
      </div>
      
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={styles.bulletContent}
          style={{
            direction: 'ltr',
            textAlign: 'left',
            border: '1px dashed #aaa',
            resize: 'none',
            overflow: 'hidden',
            background: 'transparent',
            padding: '2px',
            width: '100%',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            margin: '0',
            minHeight: '1.4em',
            lineHeight: 'inherit'
          }}
          placeholder={placeholder}
          rows={1}
        />
      ) : (
        <span 
          ref={contentRef}
          className={styles.bulletContent}
          onClick={handleClick}
          style={{ 
            cursor: 'text', 
            direction: 'ltr', 
            textAlign: 'left'
          }}
        >
          {value || <span style={{ color: '#999' }}>{placeholder}</span>}
        </span>
      )}
    </li>
  );
};

export default EditableBulletItem; 