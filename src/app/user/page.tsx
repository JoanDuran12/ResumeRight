'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import User from "../components/User";

export default function UserPage() {
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
            <User />
        </>
    );
}