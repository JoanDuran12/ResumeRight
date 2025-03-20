'use client'

import { IconFileDescription, IconSun, IconMoon } from "@tabler/icons-react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/app/contexts/ThemeContext";

const navItems = [
  {
    title: "Features",
    href: "#Features",
  },
  // {
  //   title: "Templates",
  //   href: "#Templates",
  // },
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
  const dropdownRef = useRef(null);
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-center">
      <div className="container flex h-16 items-center justify-between px-24">
        <div className="flex items-center gap-2">
          <IconFileDescription stroke={2} className="size-8" />
          <Link href="/" className="font-bold text-xl">ResumeRight</Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a key={item.title}
              className="text-sm font-medium hover:underline underline-offset-4"
              href={item.href}
              target={item.target}
            >
              {item.title}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
              <Link href="/homepage" className="hidden sm:block">
                <div className="border bg-black text-white px-3 py-2 rounded-md text-sm hover:bg-black/80 transition-colors">
                  Dashboard
                </div>
              </Link>
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center"
                >
                  <div className="overflow-hidden rounded-full w-10 h-10 border border-gray-200 hover:border-gray-300 transition-colors">
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <Link 
                      href="/user" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link href="/">
                      <button 
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                className="text-sm font-medium hover:underline underline-offset-4 hidden sm:inline-flex"
              >
                Log In
              </Link>
              
              <Link href="/homepage">
                <div className="border bg-black text-white px-3 py-2 rounded-md text-sm hover:bg-black/80 transition-colors">
                  Get Started
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;