"use client";

import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Header } from '@/components/layout/Header';
import { useRouter } from 'next/navigation';
import { User, Calendar, MapPin, History, Star, TrendingUp, ArrowRight } from 'lucide-react';
import { HistoryService } from '@/services/history.service';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, isLoading } = useAuthStore();
    const [history, setHistory] = React.useState<any[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = React.useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
        }

        if (user) {
            fetchHistory();
        }
    }, [user, isLoading, router]);

    const fetchHistory = async () => {
        if (!user) return;
        setIsHistoryLoading(true);
        try {
            const data = await HistoryService.getUserHistory(user.id);
            setHistory(data || []);
        } catch (err) {
            console.error('Fetch history error:', err);
        } finally {
            setIsHistoryLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
            <div className="mesh-bg opacity-30" />
            <Header />

            <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 relative z-10">
                <div className="flex flex-col gap-12">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 animate-fade-in-up">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-purple-500 to-blue-500 p-[1px] shadow-2xl">
                                <div className="w-full h-full rounded-[2.5rem] bg-[#0a0a0a] flex items-center justify-center">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tighter mb-1">{user.email?.split('@')[0]}</h1>
                                <p className="text-sm text-white/40 font-bold uppercase tracking-widest">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col px-8 py-4 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                                <span className="text-2xl font-black text-white">{history.length}</span>
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Analizlerim</span>
                            </div>
                            <div className="flex flex-col px-8 py-4 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                                <span className="text-2xl font-black text-white">0</span>
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Favorilerim</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Travel Character Analysis */}
                            <section className="p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-2xl animate-fade-in-up delay-100 overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-emerald-500/10" />

                                <div className="flex items-center gap-3 mb-10 relative z-10">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                    <h3 className="text-xl font-black tracking-tight">Seyahat Karakteri Analizi</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center relative z-10">
                                    <div className="md:col-span-3 space-y-6">
                                        <p className="text-base text-white/50 leading-relaxed font-medium">
                                            {history.length < 3 ? (
                                                <>Henüz yeterli karar verisi birikmedi. <strong>En az 3 farklı seyahat analizi</strong> yaptıktan sonra, yapay zeka senin saklı tercihlerini burada raporlayacak.</>
                                            ) : (
                                                <>Analizlerin baz alınarak seyahat karakterin oluşturuluyor. Patternları çözmek için verilerin işleniyor.</>
                                            )}
                                        </p>
                                        <div className="space-y-3">
                                            <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                                    style={{ width: `${Math.min((history.length / 3) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                                                <span>Veri Toplama Havuzu</span>
                                                <span>%{Math.min(Math.round((history.length / 3) * 100), 100)} Complete</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 aspect-square rounded-full border border-white/5 bg-black/40 flex flex-col items-center justify-center p-8 text-center gap-3 relative shadow-2xl">
                                        <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-2xl animate-pulse" />
                                        {history.length >= 3 ? (
                                            <span className="text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse relative z-10 text-center">Analiz Katmanı Hesaplanıyor</span>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/10 relative z-10 font-black text-xl">?</div>
                                                <span className="text-[10px] text-white/30 font-black uppercase tracking-widest relative z-10">Segment Undefined</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Analysis History */}
                            <div className="space-y-8 animate-fade-in-up delay-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-1 h-6 bg-white/20 rounded-full" />
                                    <h3 className="text-lg font-black text-white/40 uppercase tracking-[0.3em]">Analiz Geçmişi</h3>
                                </div>

                                <div className="grid gap-4">
                                    {isHistoryLoading ? (
                                        <div className="py-20 flex justify-center">
                                            <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                                        </div>
                                    ) : history.length === 0 ? (
                                        <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                                            <History className="w-12 h-12 mb-4" />
                                            <p className="text-sm font-bold uppercase tracking-widest">Kayıt Bulunamadı</p>
                                        </div>
                                    ) : (
                                        history.map((item) => (
                                            <div key={item.id} className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl flex items-center justify-between hover:bg-white/[0.05] transition-all group shadow-lg">
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${item.verdict === 'git' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        item.verdict === 'gitme' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                                                        }`}>
                                                        {item.destination_name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h4 className="text-xl font-black text-white">{item.destination_name}</h4>
                                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${item.verdict === 'git' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                                item.verdict === 'gitme' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                                }`}>
                                                                {item.verdict === 'git' ? 'GİT' : item.verdict === 'gitme' ? 'GİTME' : 'SINIRDA'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                                                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                                            <span className="w-1 h-1 bg-white/20 rounded-full" />
                                                            <span className="text-white/60">Skor: %{item.score}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Link href={`/result/${item.destination_id.toLowerCase()}`} className="p-4 rounded-2xl bg-white/[0.05] border border-white/5 hover:bg-white hover:text-black transition-all hover:scale-110 shadow-xl group">
                                                    <ArrowRight className="w-5 h-5" />
                                                </Link>
                                            </div>
                                        )
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6 animate-fade-in-up delay-300">
                            <div className="p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700" />
                                <h4 className="text-sm font-black text-white/40 uppercase tracking-[0.3em] mb-6">Ayrıcalıklı Erişim</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                        <span className="text-xs font-black text-white/80">Premium Algoritma V1.0</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                        <span className="text-xs font-black text-white/80">Gemini Pro Analizleri</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
