import React, { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  inline?: boolean;
  placeholder?: string;
}

const EditableText: React.FC<EditableTextProps> = ({ 
  value, 
  onChange, 
  className, 
  multiline = false, 
  inline = false,
  placeholder = ''
}) => {
  const [editing, setEditing] = useState(false);
  const [inputHeight, setInputHeight] = useState('auto');
  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  // Resize function for the textarea to match content
  const autoResize = () => {
    if (inputRef.current && multiline) {
      const textarea = inputRef.current as HTMLTextAreaElement;
      // Reset height to calculate scrollHeight correctly
      textarea.style.height = 'auto';
      // Set to scrollHeight to fit content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };
  
  // Initial setup and resize on value change
  useEffect(() => {
    if (editing && inputRef.current) {
      autoResize();
      
      // Position cursor at the end
      if ('selectionStart' in inputRef.current) {
        inputRef.current.selectionStart = value.length;
        inputRef.current.selectionEnd = value.length;
      }
    }
  }, [editing, value]);
  
  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            autoResize();
          }}
          onBlur={() => setEditing(false)}
          autoFocus
          className={className}
          placeholder={placeholder}
          style={{
            width: '100%',
            background: 'transparent',
            border: '1px dashed #aaa',
            font: 'inherit',
            padding: '2px',
            resize: 'none',
            overflow: 'auto',
            minHeight: '50px',
            maxHeight: '200px',
            display: inline ? 'inline-block' : 'block',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap'
          }}
        />
      );
    }
    
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        autoFocus
        className={className}
        placeholder={placeholder}
        style={{
          width: inline ? 'auto' : '100%',
          minWidth: inline ? `${Math.min(Math.max(value.length * 0.6, 1) * 8, 100)}px` : '40px',
          maxWidth: inline ? '200px' : '100%',
          background: 'transparent',
          border: '1px dashed #aaa',
          font: 'inherit',
          padding: '2px',
          display: inline ? 'inline-block' : 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      />
    );
  }
  
  return (
    <div 
      ref={textRef}
      onClick={() => setEditing(true)} 
      className={className} 
      style={{ 
        cursor: 'pointer',
        display: inline ? 'inline-block' : 'block',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap'
      }}
    >
      {value || (placeholder && <span style={{ color: '#999' }}>{placeholder}</span>)}
    </div>
  );
};

export default EditableText; 