'use client';

import { useState } from 'react';
import { parsePdf } from '@/app/gemini';
import { AppState } from './resumeEditor';
import { IconFileUpload } from '@tabler/icons-react';

interface PdfImportProps {
  onImportComplete: (appState: AppState) => void;
}

/**
 * Component for importing and parsing PDF resumes
 */
export default function PdfImport({ onImportComplete }: PdfImportProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reset state
    setError(null);
    
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    
    const formData = new FormData();
    formData.append('file', files[0]);
    
    setIsLoading(true);
    
    try {
      const appState = await parsePdf(formData);
      onImportComplete(appState);
    } catch (error) {
      console.error("Error importing PDF:", error);
      setError(error instanceof Error ? error.message : "Failed to import PDF");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="relative">
      <input 
        type="file"
        id="pdf-upload"
        accept="application/pdf"
        onChange={handleFileChange}
        disabled={isLoading}
        className="hidden"
      />
      <label 
        htmlFor="pdf-upload" 
        className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white rounded-md px-4 py-1.5 transition-colors cursor-pointer"
      >
        <IconFileUpload size={18} stroke={1.5} />
        <span className="text-sm font-medium">
          {isLoading ? "Importing..." : "Import Resume"}
        </span>
      </label>
      
      {error && (
        <div className="absolute top-full left-0 mt-1 text-red-500 text-xs whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
} 