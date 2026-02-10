"use client";

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Header } from '@/components/layout/Header';
import { useRouter } from 'next/navigation';
import {
    User, Calendar, MapPin, History, Star, TrendingUp, ArrowRight,
    Crown, Leaf, Compass, Wallet, Zap, Heart, Plus, Trash2, CheckCircle2, Circle
} from 'lucide-react';
import { HistoryService } from '@/services/history.service';
import { analyzeTravelPersonality, PERSONALITIES, Personality } from '@/lib/analysis/personality';
import { UnsplashService } from '@/lib/images/unsplash';
import Link from 'next/link';

const ICON_MAP: Record<string, any> = {
    Crown, Leaf, Compass, Wallet, Zap
};

export default function ProfilePage() {
    const { user, isLoading } = useAuthStore();
    const [history, setHistory] = useState<any[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);
    const [personality, setPersonality] = useState<Personality | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
    const [expandedTodoId, setExpandedTodoId] = useState<string | null>(null);
    const [todoInput, setTodoInput] = useState('');
    const [destinationImages, setDestinationImages] = useState<Record<string, string>>({});
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
            const result = analyzeTravelPersonality(data || []);
            setPersonality(result);

            // Fetch images for unique destinations
            if (data && data.length > 0) {
                const uniqueDestinations = Array.from(new Set(data.map((h: any) => h.destination_name)));
                // To avoid rate limits, only fetch for the first few or handle sequentially
                // For now, let's fetch for the unique ones (limit 10 for safety)
                uniqueDestinations.slice(0, 10).forEach(async (name: any) => {
                    const img = await UnsplashService.searchDestinationImage(name);
                    if (img) {
                        setDestinationImages(prev => ({ ...prev, [name]: img.url }));
                    }
                });
            }
        } catch (err) {
            console.error('Fetch history error:', err);
        } finally {
            setIsHistoryLoading(false);
        }
    };

    const handleAddTodo = async (decisionId: string) => {
        if (!todoInput.trim()) return;
        const decision = history.find(h => h.id === decisionId);
        const newList = [...(decision.todo_list || []), { text: todoInput.trim(), completed: false, id: Date.now().toString() }];

        try {
            await HistoryService.updateTodoList(decisionId, newList);
            setHistory(history.map(h => h.id === decisionId ? { ...h, todo_list: newList } : h));
            setTodoInput('');
        } catch (err) {
            console.error('Failed to add todo:', err);
        }
    };

    const toggleTodo = async (decisionId: string, todoId: string) => {
        const decision = history.find(h => h.id === decisionId);
        const newList = decision.todo_list.map((t: any) =>
            t.id === todoId ? { ...t, completed: !t.completed } : t
        );

        try {
            await HistoryService.updateTodoList(decisionId, newList);
            setHistory(history.map(h => h.id === decisionId ? { ...h, todo_list: newList } : h));
        } catch (err) {
            console.error('Failed to toggle todo:', err);
        }
    };

    const deleteTodo = async (decisionId: string, todoId: string) => {
        const decision = history.find(h => h.id === decisionId);
        const newList = decision.todo_list.filter((t: any) => t.id !== todoId);

        try {
            await HistoryService.updateTodoList(decisionId, newList);
            setHistory(history.map(h => h.id === decisionId ? { ...h, todo_list: newList } : h));
        } catch (err) {
            console.error('Failed to delete todo:', err);
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

    const favoriteHistory = history.filter(h => h.is_favorite);
    const displayedHistory = activeTab === 'all' ? history : favoriteHistory;

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30 overflow-x-hidden">
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
                            <div className="flex flex-col px-8 py-4 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl transition-all cursor-pointer hover:bg-white/[0.05]" onClick={() => setActiveTab('all')}>
                                <span className={`text-2xl font-black ${activeTab === 'all' ? 'text-white' : 'text-white/40'}`}>{history.length}</span>
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Analizlerim</span>
                            </div>
                            <div className="flex flex-col px-8 py-4 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl transition-all cursor-pointer hover:bg-white/[0.05]" onClick={() => setActiveTab('favorites')}>
                                <span className={`text-2xl font-black ${activeTab === 'favorites' ? 'text-rose-400' : 'text-white/40'}`}>{favoriteHistory.length}</span>
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Favorilerim</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">

                            {/* Personality Analysis */}
                            <section className="p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl shadow-2xl animate-fade-in-up delay-100 overflow-hidden relative group">
                                <div className={`absolute top-0 right-0 w-64 h-64 ${personality ? personality.bgColor : 'bg-emerald-500/5'} rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:scale-110`} />
                                <div className="flex items-center gap-3 mb-10 relative z-10">
                                    <TrendingUp className={`w-5 h-5 ${personality ? personality.color : 'text-emerald-400'}`} />
                                    <h3 className="text-xl font-black tracking-tight">Seyahat Karakteri Analizi</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center relative z-10">
                                    <div className="md:col-span-3 space-y-6">
                                        <div className="text-base text-white/50 leading-relaxed font-medium">
                                            {history.length < 3 ? (
                                                <p>Henüz yeterli karar verisi birikmedi. <strong>En az 3 farklı seyahat analizi</strong> yaptıktan sonra, yapay zeka senin saklı tercihlerini burada raporlayacak.</p>
                                            ) : personality ? (
                                                <p><strong className={personality.color}>{personality.title}:</strong> {personality.description}</p>
                                            ) : (
                                                <p>Analizlerin baz alınarak seyahat karakterin oluşturuluyor. Patternları çözmek için verilerin işleniyor.</p>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${personality ? 'from-' + personality.color.replace('text-', '') + '-600 to-' + personality.color.replace('text-', '') + '-400' : 'from-emerald-600 to-emerald-400'} transition-all duration-1000`}
                                                    style={{ width: `${Math.min((history.length / 3) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                                                <span>Veri Toplama Havuzu</span>
                                                <span>%{Math.min(Math.round((history.length / 3) * 100), 100)} Complete</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`md:col-span-2 aspect-square rounded-full border border-white/5 bg-black/40 flex flex-col items-center justify-center p-8 text-center gap-3 relative shadow-2xl ${personality ? personality.borderColor : ''}`}>
                                        <div className={`absolute inset-0 ${personality ? personality.bgColor : 'bg-emerald-500/5'} rounded-full blur-2xl animate-pulse`} />
                                        {personality ? (
                                            <>
                                                {React.createElement(ICON_MAP[personality.icon], { className: `w-12 h-12 mb-2 ${personality.color}` })}
                                                <span className={`${personality.color} font-black uppercase tracking-[0.2em] text-xs relative z-10 text-center`}>{personality.title}</span>
                                            </>
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/10 font-black text-xl">?</div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Analysis History with To-Do Lists and Images */}
                            <div className="space-y-8 animate-fade-in-up delay-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1 h-6 bg-white/20 rounded-full" />
                                        <h3 className="text-lg font-black text-white/40 uppercase tracking-[0.3em]">
                                            {activeTab === 'all' ? 'Analiz Geçmişi' : 'Favori Rotalarım'}
                                        </h3>
                                    </div>
                                    <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                                        <button onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'all' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>Tümü</button>
                                        <button onClick={() => setActiveTab('favorites')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'favorites' ? 'bg-rose-500 text-white' : 'text-white/40 hover:text-white'}`}>Favoriler</button>
                                    </div>
                                </div>

                                <div className="grid gap-6">
                                    {isHistoryLoading ? (
                                        <div className="py-20 flex justify-center"><div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" /></div>
                                    ) : displayedHistory.length === 0 ? (
                                        <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                                            <History className="w-12 h-12 mb-4" />
                                            <p className="text-sm font-bold uppercase tracking-widest">Kayıt Bulunamadı</p>
                                        </div>
                                    ) : (
                                        displayedHistory.map((item) => (
                                            <div key={item.id} className="flex flex-col gap-1">
                                                <div className="p-6 md:p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col md:flex-row items-center justify-between hover:bg-white/[0.05] transition-all group shadow-lg gap-6">
                                                    <div className="flex items-center gap-6 w-full">
                                                        <div className="relative">
                                                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden flex items-center justify-center text-xl font-black relative z-10 ${item.verdict === 'git' ? 'bg-emerald-500/10 text-emerald-400' :
                                                                item.verdict === 'gitme' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                                                                }`}>
                                                                {destinationImages[item.destination_name] ? (
                                                                    <img src={destinationImages[item.destination_name]} alt={item.destination_name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                                ) : (
                                                                    item.destination_name[0]
                                                                )}
                                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                                                            </div>
                                                            <div className={`absolute -inset-1 ${item.verdict === 'git' ? 'bg-emerald-500/20' : item.verdict === 'gitme' ? 'bg-red-500/20' : 'bg-yellow-500/20'} rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-all`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                                <h4 className="text-xl md:text-2xl font-black text-white truncate">{item.destination_name}</h4>
                                                                {item.is_favorite && <Heart className="w-4 h-4 text-rose-500 fill-current" />}
                                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${item.verdict === 'git' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                                    item.verdict === 'gitme' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                                    }`}>
                                                                    {item.verdict === 'git' ? 'GİT' : item.verdict === 'gitme' ? 'GİTME' : 'SINIRDA'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                                                                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                                                <span className="hidden md:inline w-1 h-1 bg-white/20 rounded-full" />
                                                                <span className="text-white/60">Skor: %{item.score}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 w-full md:w-auto">
                                                        <button
                                                            onClick={() => setExpandedTodoId(expandedTodoId === item.id ? null : item.id)}
                                                            className={`flex-1 md:flex-none p-4 rounded-2xl border transition-all hover:scale-105 flex items-center justify-center ${expandedTodoId === item.id ? 'bg-white text-black border-white' : 'bg-white/[0.05] border-white/5 text-white/60 hover:bg-white/10'}`}
                                                        >
                                                            <MapPin className="w-5 h-5" />
                                                            <span className="md:hidden ml-2 font-black text-[10px] uppercase tracking-widest">Planlayıcı</span>
                                                        </button>
                                                        <Link href={`/result/${item.destination_id.toLowerCase()}`} className="flex-1 md:flex-none p-4 rounded-2xl bg-white/[0.05] border border-white/5 hover:bg-white hover:text-black transition-all hover:scale-105 shadow-xl flex items-center justify-center">
                                                            <ArrowRight className="w-5 h-5" />
                                                            <span className="md:hidden ml-2 font-black text-[10px] uppercase tracking-widest">Detaylar</span>
                                                        </Link>
                                                    </div>
                                                </div>

                                                {/* Expanded To-Do List Editor */}
                                                {expandedTodoId === item.id && (
                                                    <div className="mx-4 md:mx-6 p-6 md:p-8 rounded-b-[2rem] border-x border-b border-white/5 bg-white/[0.02] backdrop-blur-3xl animate-fade-in-down mb-4">
                                                        <div className="flex items-center justify-between mb-6">
                                                            <h5 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Yapılacaklar Listesi</h5>
                                                            <span className="text-[10px] font-black px-2 py-1 bg-white/5 rounded text-white/20">{(item.todo_list || []).filter((t: any) => t.completed).length} / {(item.todo_list || []).length} Tamamlandı</span>
                                                        </div>

                                                        <div className="space-y-3 mb-6">
                                                            {(item.todo_list || []).map((todo: any) => (
                                                                <div key={todo.id} className="flex items-center justify-between group/todo p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                                                                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleTodo(item.id, todo.id)}>
                                                                        {todo.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-white/20" />}
                                                                        <span className={`text-[13px] font-medium transition-all ${todo.completed ? 'text-white/20 line-through' : 'text-white/80'}`}>{todo.text}</span>
                                                                    </div>
                                                                    <button onClick={() => deleteTodo(item.id, todo.id)} className="opacity-0 group-hover/todo:opacity-100 p-2 text-white/20 hover:text-red-400 transition-all">
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="flex gap-2">
                                                            <input
                                                                value={todoInput}
                                                                onChange={(e) => setTodoInput(e.target.value)}
                                                                onKeyDown={(e) => e.key === 'Enter' && handleAddTodo(item.id)}
                                                                placeholder="Yeni bir görev ekle..."
                                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-all"
                                                            />
                                                            <button
                                                                onClick={() => handleAddTodo(item.id)}
                                                                className="p-3 bg-white text-black rounded-xl hover:bg-white/90 transition-all"
                                                            >
                                                                <Plus className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1 space-y-6">
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
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                        <span className="text-xs font-black text-white/80">Unsplash Visual Engine</span>
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
