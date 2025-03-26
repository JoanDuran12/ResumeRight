import React from 'react';
import styles from '@/app/resume.module.css';

interface UndoRedoButtonsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export const UndoRedoButtons: React.FC<UndoRedoButtonsProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) => {
  return (
    <div className={styles.undoRedoContainer}>
      <button 
        className={styles.undoRedoButton}
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo (Ctrl/⌘ + Z)"
      >
        ↩ Undo
      </button>
      <button 
        className={styles.undoRedoButton}
        onClick={onRedo}
        disabled={!canRedo}
        title="Redo (Ctrl/⌘ + Shift + Z)"
      >
        ↪ Redo
      </button>
    </div>
  );
}; 