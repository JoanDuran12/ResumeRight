import React, { useRef, useState, useEffect } from "react";
import {
  IconFileText,
  IconFileUpload,
  IconPlus,
  IconCheck,
} from "@tabler/icons-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

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
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState({
    fileName: "",
    fileSize: "",
    uploadDate: "",
  });
  const [showJobDescriptionPopup, setShowJobDescriptionPopup] = useState(false);
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);

  const [jobDescription, setJobDescription] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("jobDescription");
    if (saved) setJobDescription(saved);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is a PDF
      if (file.type === "application/pdf") {
        console.log("PDF file selected:", file.name);

        // Format file size
        const fileSize = formatFileSize(file.size);

        // Get current date and time
        const now = new Date();
        const formattedDate = now.toLocaleDateString();
        const formattedTime = now.toLocaleTimeString();

        // Set success details
        setSuccessDetails({
          fileName: file.name,
          fileSize: fileSize,
          uploadDate: `${formattedDate} at ${formattedTime}`,
        });

        // Show success popup
        setShowSuccess(true);

        // Continue with processing the PDF
        // Add your PDF processing logic here
      } else {
        // Show error popup for non-PDF files
        setErrorMessage("Please upload a PDF file only.");
        setShowError(true);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const closeErrorPopup = () => {
    setShowError(false);
  };

  const closeSuccessPopup = () => {
    setShowSuccess(false);
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
      href: "/saved",
    },
    {
      id: "import-pdf",
      title: "Import PDF",
      description: "Upload a new PDF file to your account",
      icon: <IconFileUpload size={64} stroke={1.5} />,
      action: "Upload",
      onClick: () => fileInputRef.current?.click(),
      requiresAuth: false,
      href: "",
    },
    {
      id: "create-new",
      title: "Create New",
      description: "Start a fresh document from scratch",
      icon: <IconPlus size={64} stroke={1.5} />,
      action: "Create",
      onClick: () => router.push("/editor"),
      requiresAuth: false,
      href: "/editor",
    },
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
        style={{ display: "none" }}
      />

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            {user ? `Welcome back!` : "Welcome!"}
          </h1>
          <p className="text-[var(--foreground)] opacity-70">
            Select an option to get started
          </p>
        </div>

        {loading ? (
          // Loading state
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-[var(--foreground)]">
              Loading...
            </div>
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
                    ? "cursor-not-allowed hover:shadow-none"
                    : "cursor-pointer hover:shadow-lg"
                }`}
              >
                {card.requiresAuth && !user && (
                  <div className="absolute opacity-0 group-hover:opacity-100 w-full text-center text-sm text-white bg-black p-2 top-0">
                    Sign in required
                  </div>
                )}

                <div
                  className={`p-6 ${
                    card.requiresAuth && !user ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex justify-center items-center h-32 mb-4 text-[var(--foreground)]">
                    {card.icon}
                  </div>
                  <h3 className="text-center text-lg font-medium text-[var(--foreground)]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-center text-sm text-[var(--foreground)] opacity-70">
                    {card.description}
                  </p>
                </div>
                <div
                  className={`bg-[var(--background)] bg-opacity-50 px-4 py-3 border-t border-[var(--foreground)] border-opacity-10 ${
                    card.requiresAuth && !user ? "opacity-50" : ""
                  }`}
                >
                  <div className="w-full text-center text-sm font-medium text-[var(--foreground)]">
                    {card.action}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Error Popup */}
        {showError && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              <div className="flex justify-end">
                <button
                  onClick={closeErrorPopup}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Popup */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg border p-6 max-w-md w-full shadow-xl">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-3">
                  <IconCheck size={24} className="text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  PDF Successfully Uploaded
                </h3>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    File Name:
                  </span>
                  <p className="text-gray-900">{successDetails.fileName}</p>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    File Size:
                  </span>
                  <p className="text-gray-900">{successDetails.fileSize}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Upload Date:
                  </span>
                  <p className="text-gray-900">{successDetails.uploadDate}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={closeSuccessPopup}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    closeSuccessPopup(); // hides success
                    setShowJobDescriptionPopup(true); // shows the next popup
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {showJobDescriptionPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white border rounded-lg p-6 max-w-xl w-full shadow-xl">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Enter Job Description
              </h3>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4 resize-none"
                rows={5}
                placeholder="Paste or type the job description here..."
              />

              <div className="flex justify-between space-x-2">
                <button
                  onClick={() => setShowJobDescriptionPopup(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem("jobDescription");
                    setJobDescription("");
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem("jobDescription", jobDescription);
                    setShowJobDescriptionPopup(false);
                    setIsGeneratingResume(true);

                    // setTimeout(() => {
                    //   setIsGeneratingResume(false);
                    //   router.push("/resume"); // update as needed
                    // }, 3000);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {isGeneratingResume && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white border rounded-lg p-6 max-w-sm w-full shadow-xl flex flex-col items-center">
              <svg
                className="animate-spin h-8 w-8 text-blue-600 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"
                />
              </svg>
              <p className="text-gray-800 text-lg font-medium">
                Generating resume, please wait...
              </p>
              <button
                onClick={() => setIsGeneratingResume(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mt-8"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
