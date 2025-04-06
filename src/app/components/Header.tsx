'use client'

import { IconSun, IconMoon, IconDownload, IconDeviceFloppy } from "@tabler/icons-react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/app/contexts/ThemeContext";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "Features",
    href: "#Features",
  },
  {
    title: "GitHub",
    href: "https://github.com/JoanDuran12/ResumeRight",
    target: "_blank",
  },
  {
    title: "FAQ",
    href: "#FAQ",
  },
];


function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  
  // Check if we're on the editor page
  const isEditorPage = pathname === "/editor" || pathname?.startsWith("/editor/");
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleSignOut = () => {
    logout();
    setDropdownOpen(false);
  };
  
  return (
    <div className="w-full bg-background pt-4 px-4 sticky top-0 z-50">
      <header className="max-w-7xl mx-auto bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border border-gray-200 dark:border-gray-800 rounded-lg px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 relative">
                <Image
                  src="/logo.svg"
                  alt="ResumeRight Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-bold text-xl">ResumeRight</span>
            </Link>
          </div>
        
          
          {/* Right Side - User Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <IconSun size={20} className="text-yellow-500" />
              ) : (
                <IconMoon size={20} className="text-gray-700" />
              )}
            </button>

            {user ? (
              <>
                <Link href="/homepage">
                  <div className="border border-gray-200 dark:border-gray-700 bg-white hover:bg-gray-50 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Dashboard
                  </div>
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center"
                  >
                    <div className="overflow-hidden rounded-lg w-10 h-10 border border-gray-200 hover:border-gray-300 transition-colors">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                          {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                      <Link 
                        href="/user" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <Link href="/">
                        <button 
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Sign Out
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="px-5 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:flex"
                >
                  Sign in
                </Link>
                
                <Link href="/homepage">
                  <div className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
                    Get Started
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;