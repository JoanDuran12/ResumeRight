import React, { useRef, useState } from 'react';
import { IconFileText, IconFileUpload, IconPlus, IconX } from '@tabler/icons-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { parsePdf, checkIfResume } from '@/app/gemini';
import { toast, Toaster } from 'react-hot-toast';

interface DashboardCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  onClick: () => void;
  requiresAuth: boolean;
  href: string;
}

// Custom toast component with blur background
const CustomToast = ({ message, type = 'error', onClose }) => {
  return (
    <div className="flex items-center bg-white bg-opacity-90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-4 max-w-md">
      <div className={`mr-3 text-2xl ${type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
        {type === 'error' ? '⚠️' : '✅'}
      </div>
      <div className="flex-1 mr-2">
        <p className="text-gray-800">{message}</p>
      </div>
      <button 
        onClick={onClose} 
        className="text-gray-500 hover:text-gray-700"
      >
        <IconX size={18} />
      </button>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      setImportError(null);
      
      // Create FormData to pass to validation and parsePdf
      const formData = new FormData();
      formData.append('file', file);
      
      // First validate that the file is a resume
      const validationResult = await checkIfResume(formData);
      
      if (!validationResult.isValid) {
        // Show error toast with custom component
        toast.custom((t) => (
          <CustomToast 
            message={validationResult.error || "This file doesn't appear to be a resume."} 
            type="error"
            onClose={() => toast.dismiss(t.id)}
          />
        ), { duration: 5000 });
        
        setImportError(validationResult.error || "This file doesn't appear to be a resume.");
        setIsImporting(false);
        
        // Reset the input to allow selecting the same file again
        if (event.target) event.target.value = '';
        return;
      }
      
      // If valid, use the parsePdf function to process the PDF
      const resumeData = await parsePdf(formData);
      
      // Save the parsed data to localStorage for the editor to load
      localStorage.setItem('resumeEditorData', JSON.stringify({
        currentState: resumeData,
        savedAt: new Date().toISOString()
      }));
      
      // Show success toast
      toast.custom((t) => (
        <CustomToast 
          message="Resume imported successfully!" 
          type="success"
          onClose={() => toast.dismiss(t.id)}
        />
      ), { duration: 3000 });
      
      // Navigate to the editor page
      router.push('/editor');
    } catch (error) {
      console.error('Error importing PDF:', error);
      
      // Show error toast
      toast.custom((t) => (
        <CustomToast 
          message={error instanceof Error ? error.message : 'Failed to import PDF'} 
          type="error"
          onClose={() => toast.dismiss(t.id)}
        />
      ), { duration: 5000 });
      
      setImportError(error instanceof Error ? error.message : 'Failed to import PDF');
    } finally {
      setIsImporting(false);
      // Reset the input to allow selecting the same file again
      if (event.target) event.target.value = '';
    }
  };

  const dashboardCards: DashboardCardProps[] = [
    {
      id: "view-saved",
      title: "View Saved Items",
      description: "Access your previously saved documents",
      icon: <IconFileText size={64} stroke={1.5} />,
      action: "Open",
      onClick: () => router.push("/saved"),
      requiresAuth: true,
      href: "/saved"
    },
    {
      id: "import-pdf",
      title: isImporting ? "Importing..." : "Import PDF",
      description: importError || "Upload a resume PDF file to edit",
      icon: <IconFileUpload size={64} stroke={1.5} />,
      action: isImporting ? "Processing..." : "Upload",
      onClick: () => fileInputRef.current?.click(),
      requiresAuth: false,
      href: ""
    },
    {
      id: "create-new",
      title: "Create New",
      description: "Start a fresh document from scratch",
      icon: <IconPlus size={64} stroke={1.5} />,
      action: "Create",
      onClick: () => router.push("/editor"),
      requiresAuth: false,
      href: "/editor"
    }
  ];

  const handleCardClick = (card: DashboardCardProps) => {
    if (!(card.requiresAuth && !user)) {
      if (card.href) {
        router.push(card.href);
      } else {
        card.onClick();
      }
    }
  };
  
  return (
    <div className="max-h-screen bg-[var(--background)]">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="application/pdf"
        style={{ display: 'none' }}
      />
      
      {/* Toaster for showing notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
          },
        }}
      />
      
      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            {user ? `Welcome back!` : 'Welcome!'}
          </h1>
          <p className="text-[var(--foreground)] opacity-70">Select an option to get started</p>
        </div>

        {loading ? (
          // Loading state
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-[var(--foreground)]">Loading...</div>
          </div>
        ) : (
          // Card Grid
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardCards.map((card) => (
              <button 
                key={card.id}
                onClick={() => handleCardClick(card)}
                disabled={card.requiresAuth && !user || isImporting && card.id === "import-pdf"}
                className={`group relative w-full bg-[var(--background)] border border-[var(--foreground)] border-opacity-10 overflow-hidden shadow rounded-lg transition duration-200 ${
                  (card.requiresAuth && !user) || (isImporting && card.id === "import-pdf")
                    ? 'cursor-not-allowed hover:shadow-none' 
                    : 'cursor-pointer hover:shadow-lg'
                }`}
              >
                {card.requiresAuth && !user && (
                  <div className="absolute opacity-0 group-hover:opacity-100 w-full text-center text-sm text-white bg-black p-2 top-0">
                    Sign in required
                  </div>
                )}
                
                <div className={`p-6 ${card.requiresAuth && !user ? 'opacity-50' : ''}`}>
                  <div className="flex justify-center items-center h-32 mb-4 text-[var(--foreground)]">
                    {card.icon}
                  </div>
                  <h3 className="text-center text-lg font-medium text-[var(--foreground)]">{card.title}</h3>
                  <p className={`mt-2 text-center text-sm ${importError && card.id === "import-pdf" ? "text-red-500" : "text-[var(--foreground)] opacity-70"}`}>
                    {card.description}
                  </p>
                </div>
                <div className={`bg-[var(--background)] bg-opacity-50 px-4 py-3 border-t border-[var(--foreground)] border-opacity-10 ${card.requiresAuth && !user ? 'opacity-50' : ''}`}>
                  <div 
                    className="w-full text-center text-sm font-medium text-[var(--foreground)]"
                  >
                    {card.action}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;