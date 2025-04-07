'use client';
import { IconFileDescription } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithGoogle, handleRedirectResult } from "../firebase/config";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";

export default function Login() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [authError, setAuthError] = useState<string | null>(null);
    
    useEffect(() => {
        const checkRedirectResult = async () => {
            console.log("Checking for redirect result");
            try {
                const redirectSuccess = await handleRedirectResult();
                if (redirectSuccess) {
                    console.log("Redirect sign-in successful");
                } else {
                    console.log("No redirect result found or sign-in was unsuccessful");
                }
            } catch (error) {
                console.error("Error handling redirect:", error);
                setAuthError("Failed to complete the sign-in process. Please try again.");
            }
        };
        
        if (!user && !loading) {
            checkRedirectResult();
        }
    }, [loading, user]);
    
    useEffect(() => {
        console.log("Auth state changed:", { user, loading });
        if (user) {
            console.log("User is signed in:", {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName
            });
            router.push("/homepage");
        }
    }, [user, loading, router]);

    const handleGoogleSignIn = async () => {
        console.log("Starting Google sign-in process...");
        setAuthError(null);
        
        try {
            console.log("Calling signInWithGoogle function");
            const success = await signInWithGoogle();
            console.log("Sign-in function completed", success ? "successfully" : "unsuccessfully");
            
            if (!success) {
                // Don't show error for user-cancelled operations
                console.log("Sign-in was not successful, but no error occurred (likely user cancelled)");
            }
        } catch (error: any) {
            console.error("Google sign-in failed with error:", error);
            
            // Handle different error codes with user-friendly messages
            if (error.code === 'auth/popup-blocked') {
                setAuthError("Your browser blocked the login popup. Please allow popups for this site and try again.");
            } else if (error.code === 'auth/cancelled-popup-request') {
                // This is handled in the config file, but as a fallback:
                console.log("A popup is already open");
            } else if (error.code === 'auth/popup-closed-by-user') {
                // User closed the popup, don't show error
                console.log("User closed the login popup");
            } else {
                setAuthError(error.message || "Failed to sign in with Google. Please try again later.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
            
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center space-y-10">
                    <div className="flex items-center justify-center">
                        <IconFileDescription stroke={2} className="size-8 mr-3" />
                        <h1 className="text-3xl font-bold">Welcome to ResumeRight</h1>
                    </div>
                    
                    {authError && (
                        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <p>{authError}</p>
                        </div>
                    )}
                    
                    <div className="w-full space-y-4">
                        <button 
                            className="flex items-center justify-center gap-2 w-full bg-[#202124] hover:bg-[#303134] text-white py-3 px-4 rounded transition-colors"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                        >
                            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                <path fill="none" d="M0 0h48v48H0z"/>
                            </svg>
                            {loading ? 'Signing In...' : 'Sign in with Google'}
                        </button>
                        
                        <Link href="/homepage">
                            <button 
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded transition-colors"
                                onClick={() => console.log("Continue as guest clicked")}
                                disabled={loading}
                            >
                                Continue as Guest
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}