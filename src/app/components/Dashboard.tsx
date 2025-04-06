import React, { useRef } from 'react';
import { IconFileText, IconFileUpload, IconPlus } from '@tabler/icons-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
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
      title: "Import PDF",
      description: "Upload a new PDF file to your account",
      icon: <IconFileUpload size={64} stroke={1.5} />,
      action: "Upload",
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
        accept=".pdf"
        style={{ display: 'none' }}
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
                disabled={card.requiresAuth && !user}
                className={`group relative w-full bg-[var(--background)] border border-[var(--foreground)] border-opacity-10 overflow-hidden shadow rounded-lg transition duration-200 ${
                  card.requiresAuth && !user 
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
                  <p className="mt-2 text-center text-sm text-[var(--foreground)] opacity-70">{card.description}</p>
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