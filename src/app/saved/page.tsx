'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import Saved from "../components/Saved";

export default function SavedPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <Header />
            <Saved />
        </>
    );
}