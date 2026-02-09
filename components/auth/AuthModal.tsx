"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { setUser } = useAuthStore();

    if (!isOpen) return null;

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                setUser(data.user);
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    }
                });
                if (error) throw error;
                if (data.user) {
                    alert('Doğrulama e-postası gönderildi! Lütfen e-postanızı kontrol edin.');
                }
            }
            onClose();
        } catch (err: any) {
            setError(err.message || 'Bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in-up">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-white mb-2">
                        {isLogin ? 'Tekrar Hoş Geldin' : 'Gitmece\'ye Katıl'}
                    </h2>
                    <p className="text-sm text-white/40">
                        {isLogin ? 'Stratejik kararlarına kaldığın yerden devam et.' : 'Kararlarını kaydet ve seyahat karakterini oluştur.'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">E-posta</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ornek@mail.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-white/20 focus:bg-white/10 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Şifre</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-white/20 focus:bg-white/10 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-white/40 hover:text-white transition-colors"
                    >
                        {isLogin ? (
                            <>Hesabın yok mu? <span className="text-white font-bold underline">Kayıt Ol</span></>
                        ) : (
                            <>Zaten hesabın var mı? <span className="text-white font-bold underline">Giriş Yap</span></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
