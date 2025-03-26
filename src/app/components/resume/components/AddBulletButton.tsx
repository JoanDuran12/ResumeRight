import React from 'react';

interface AddBulletButtonProps {
  onClick: () => void;
}

const AddBulletButton: React.FC<AddBulletButtonProps> = ({ onClick }) => {
  return (
    // <li>
    //   <button 
    //     onClick={onClick}
    //     style={{
    //       background: 'transparent',
    //       border: '1px dashed #aaa',
    //       cursor: 'pointer',
    //       padding: '2px 6px',
    //       fontSize: '10px',
    //       marginTop: '5px'
    //     }}
    //   >
    //     + Add bullet
    //   </button>
    // </li>
    <></>
  );
};

export default AddBulletButton; 