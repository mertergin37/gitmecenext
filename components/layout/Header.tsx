"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/design-system/primitives/Logo';
import { useAuthStore } from '@/store/auth.store';
import { AuthModal } from '../auth/AuthModal';
import { User, LogOut, UserCircle } from 'lucide-react';

export const Header: React.FC = () => {
    const { user, signOut, initialize } = useAuthStore();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <>
            <header className="relative z-50 flex justify-between items-center p-6 md:p-10 max-w-7xl mx-auto w-full">
                <Link href="/">
                    <Logo />
                </Link>

                <div className="flex items-center gap-4 md:gap-8">
                    <nav className="hidden md:flex gap-8 text-sm font-medium text-white/60">
                        <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
                        <Link href="/manifesto" className="hover:text-white transition-colors">Manifesto</Link>
                    </nav>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link
                                href="/profile"
                                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                            >
                                <UserCircle className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm font-bold text-white hidden sm:inline">Profilim</span>
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-all"
                                title="Çıkış Yap"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="px-6 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all"
                        >
                            Giriş Yap
                        </button>
                    )}
                </div>
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
};
