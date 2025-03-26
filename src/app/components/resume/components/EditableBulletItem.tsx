import React, { useState } from 'react';

interface EditableBulletItemProps {
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
}

const EditableBulletItem: React.FC<EditableBulletItemProps> = ({ value, onChange, onDelete }) => {
  const [editing, setEditing] = useState(false);
  
  if (editing) {
    return (
      <li style={{ position: 'relative' }}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          autoFocus
          style={{
            width: '100%',
            background: 'transparent',
            border: '1px dashed #aaa',
            font: 'inherit',
            padding: '2px',
            resize: 'vertical',
            minHeight: '50px'
          }}
        />
        <button 
          onClick={onDelete}
          style={{
            position: 'absolute',
            right: '-25px',
            top: '0',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#f44336',
            fontSize: '16px'
          }}
        >
          ×
        </button>
      </li>
    );
  }
  
  return (
    <li 
      onClick={() => setEditing(true)} 
      style={{ cursor: 'pointer', position: 'relative' }}
      onMouseEnter={(e) => {
        const button = e.currentTarget.querySelector('button');
        if (button) button.style.display = 'block';
      }}
      onMouseLeave={(e) => {
        const button = e.currentTarget.querySelector('button');
        if (button) button.style.display = 'none';
      }}
    >
      {value}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        style={{
          position: 'absolute',
          right: '-25px',
          top: '0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#f44336',
          fontSize: '16px',
          display: 'none'
        }}
      >
        ×
      </button>
    </li>
  );
};

export default EditableBulletItem; 