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
  inline = true,
  placeholder = ''
}) => {
  const [editing, setEditing] = useState(false);
  const [textWidth, setTextWidth] = useState<number | null>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const measurementRef = useRef<HTMLSpanElement>(null);
  
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

  // Function to measure text width
  const measureText = () => {
    if (measurementRef.current) {
      // Set the content to measure (value or placeholder)
      const displayText = value || placeholder;
      measurementRef.current.textContent = displayText;
      
      // Get the exact text width
      const textSize = measurementRef.current.getBoundingClientRect().width;
      
      // Add padding (24px = 12px on each side)
      const calculatedWidth = textSize + 24;
      
      // Set minimum and maximum widths
      const minWidth = 50; // Minimum width in pixels
      const maxWidth = inline ? 300 : 600; // Maximum width depending on inline mode
      
      setTextWidth(Math.min(Math.max(calculatedWidth, minWidth), maxWidth));
    }
  };
  
  // Measure text immediately when component mounts
  useEffect(() => {
    measureText();
  }, []);
  
  // Measure text whenever value or placeholder changes
  useEffect(() => {
    measureText();
  }, [value, placeholder]);
  
  // Handle input focus and position cursor when editing begins
  useEffect(() => {
    if (editing && inputRef.current) {
      autoResize();
      
      // Position cursor at the end
      if ('selectionStart' in inputRef.current) {
        inputRef.current.selectionStart = value.length;
        inputRef.current.selectionEnd = value.length;
      }
      
      // Ensure width is measured right after editing starts
      setTimeout(measureText, 0);
    }
  }, [editing]);
  
  if (editing) {
    if (multiline) {
      return (
        <>
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              autoResize();
              measureText();
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
              padding: '2px 12px 20x',
              resize: 'none',
              overflow: 'auto',
              minHeight: '50px',
              maxHeight: '200px',
              display: inline ? 'inline-block' : 'block',
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          />
          {/* Hidden span for text measurement */}
          <span
            ref={measurementRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              visibility: 'hidden',
              whiteSpace: 'pre',
              font: 'inherit',
              padding: '0',
              border: '0'
            }}
          />
        </>
      );
    }
    
    return (
      <>
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            measureText();
          }}
          onBlur={() => setEditing(false)}
          autoFocus
          className={className}
          placeholder={placeholder}
          style={{
            width: textWidth ? `${textWidth}px` : 'auto',
            background: 'transparent',
            border: '1px dashed #aaa',
            font: 'inherit',
            padding: '2px 12px',
            display: inline ? 'inline-block' : 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        />
        {/* Hidden span for text measurement */}
        <span
          ref={measurementRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            visibility: 'hidden',
            height: 0,
            overflow: 'hidden',
            whiteSpace: 'pre',
            font: 'inherit',
            padding: '0',
            border: '0'
          }}
        />
      </>
    );
  }
  
  return (
    <>
      <div 
        ref={textRef}
        onClick={() => setEditing(true)} 
        className={className} 
        style={{ 
          cursor: 'pointer',
          display: inline ? 'inline-block' : 'block',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          padding: '2px',
          minWidth: value ? 'auto' : '50px'
        }}
      >
        {value || (placeholder && <span style={{ color: '#999' }}>{placeholder}</span>)}
      </div>
      {/* Hidden span for text measurement */}
      <span
        ref={measurementRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre',
          font: 'inherit',
          padding: '0',
          border: '0'
        }}
      />
    </>
  );
};

export default EditableText;