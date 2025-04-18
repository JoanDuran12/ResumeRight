"use client";

import {
  IconSun,
  IconMoon,
  IconDownload,
  IconFileCheck,
} from "@tabler/icons-react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/app/contexts/ThemeContext";
import Image from "next/image";
import { downloadElementAsPDF } from "../../download/Download";

function EditorPageHeader() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
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

  const [pdfElement, setPdfElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Get the convertPDF element after the component mounts
    const element = document.getElementById("convertPDF");
    setPdfElement(element);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-300 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-center">
      <div className="container flex h-16 items-center justify-between px-24">
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
        <nav className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-x-2 border bg-black text-white px-3 py-2 rounded-md text-sm hover:bg-black/80 transition-colors">
            <IconFileCheck stroke={2} /> Save
          </div>
          <div
            className="flex items-center gap-x-2 border bg-black text-white px-3 py-2 rounded-md text-sm hover:bg-black/80 transition-colors"
            onClick={() => {
              if (pdfElement) {
                downloadElementAsPDF(pdfElement);
              } else {
                console.error("PDF element not found");
              }
            }}
          >
            <IconDownload stroke={2} />
            Download
          </div>
        </nav>
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              theme === "dark" ? "hover:bg-gray-200" : "hover:bg-black"
            } transition-colors group`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <IconSun
                size={20}
                className="text-yellow-500 group-hover:text-yellow-500"
              />
            ) : (
              <IconMoon
                size={20}
                className="text-black group-hover:text-white"
              />
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
                        {user.displayName
                          ? user.displayName.charAt(0).toUpperCase()
                          : "U"}
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

export default EditorPageHeader;
