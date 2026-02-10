"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDecisionStore } from '@/store/decision.store';
import { QUESTIONS } from '@/features/decision-flow/config/questions';
import { findBestMatch } from '@/lib/decision-engine/scoring';
import { OptionCard } from './components/OptionCard';
import { ProgressBar } from './components/ProgressBar';

export const DecisionStepper = () => {
    const router = useRouter();
    const {
        currentQuestionIndex,
        setAnswer,
        nextQuestion,
        answers,
        setDestination,
        selectedDestination,
        setMonth,
        selectedMonth
    } = useDecisionStore();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [destinationInput, setDestinationInput] = useState('');

    const MONTHS = [
        "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];

    // Derived state
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const isFinished = currentQuestionIndex >= QUESTIONS.length;

    // Always reset store on mount to ensure a fresh session
    useEffect(() => {
        const { reset } = useDecisionStore.getState();
        reset();
        setIsReady(true);
    }, []);

    // Handle completion and routing
    useEffect(() => {
        if (isReady && isFinished) {
            const targetId = selectedDestination || findBestMatch(answers);
            const searchParams = new URLSearchParams();
            Object.entries(answers).forEach(([key, value]) => {
                searchParams.append(key, value.toString());
            });
            if (selectedMonth) searchParams.append('month', selectedMonth.toString());

            setTimeout(() => {
                router.push(`/result/${encodeURIComponent(targetId)}?${searchParams.toString()}`);
            }, 500);
        }
    }, [isReady, isFinished, answers, router, selectedDestination, selectedMonth]);

    const handleOptionSelect = (value: number) => {
        if (!isReady || isTransitioning) return;
        setAnswer(currentQuestion.id, value);
        setIsTransitioning(true);
        setTimeout(() => {
            nextQuestion();
            setIsTransitioning(false);
        }, 400);
    };

    const handleStartAnalysis = (e: React.FormEvent) => {
        e.preventDefault();
        if (!destinationInput.trim() || selectedMonth === null) return;

        setDestination(destinationInput.trim());
        setIsTransitioning(true);
        setTimeout(() => {
            setIsTransitioning(false);
        }, 400);
    };

    if (!isReady) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            </div>
        );
    }

    // STEP 0: Destination & Month Input
    if (!selectedDestination && !isFinished) {
        return (
            <div className="w-full max-w-4xl mx-auto px-6 py-12">
                <div className={`transition-all duration-700 ease-out transform ${isTransitioning ? 'opacity-0 -translate-y-8 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
                    <div className="mb-12">
                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] mb-2 block">Başlangıç</span>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
                            Nereye ve Ne Zaman <br /> Gidiyorsunuz?
                        </h1>
                    </div>

                    <form onSubmit={handleStartAnalysis} className="space-y-12">
                        <div className="relative group">
                            <input
                                autoFocus
                                type="text"
                                value={destinationInput}
                                onChange={(e) => setDestinationInput(e.target.value)}
                                placeholder="Şehir seçin: Örn: Paris, Tokyo..."
                                className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-2xl font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all shadow-2xl"
                            />
                        </div>

                        <div>
                            <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-6 px-2">Seyahat Ayınızı Seçin</p>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                {MONTHS.map((month, index) => (
                                    <button
                                        key={month}
                                        type="button"
                                        onClick={() => setMonth(index + 1)}
                                        className={`py-4 rounded-2xl border font-bold text-sm transition-all ${selectedMonth === index + 1
                                            ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                                            : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10'
                                            }`}
                                    >
                                        {month}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center pt-8">
                            <button
                                type="submit"
                                className="px-12 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10 disabled:opacity-20 disabled:grayscale disabled:scale-100"
                                disabled={!destinationInput.trim() || selectedMonth === null}
                            >
                                Analizi Başlat
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-white/20 text-[10px] font-black uppercase tracking-[0.3em] text-center">
                        Yapay zeka her mevsimin risklerini ve fırsatlarını hesaplar
                    </p>
                </div>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
                <div className="relative w-24 h-24 mb-10">
                    <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-white border-l-purple-500 border-r-blue-500 animate-spin shadow-[0_0_20px_rgba(168,85,247,0.4)]" />
                </div>
                <h2 className="text-4xl font-black bg-gradient-to-br from-white via-white to-white/20 bg-clip-text text-transparent tracking-tighter mb-4">
                    Stratejik Analiz...
                </h2>
                <p className="text-white/30 font-black uppercase tracking-[0.3em] text-[10px]">Veri Noktaları İşleniyor</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto px-6 py-12">
            {/* Progress Header */}
            <div className="mb-20 animate-fade-in-up">
                <div className="flex justify-between items-end mb-8 relative">
                    <span className="text-[10rem] font-black text-white/[0.03] leading-none absolute -left-10 -top-10 select-none">
                        0{currentQuestionIndex + 1}
                    </span>
                    <div className="relative z-10 flex flex-col items-start">
                        <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] mb-2">Step Descriptor</span>
                        <h3 className="text-2xl font-black text-white/80 tracking-tighter">
                            {selectedDestination} Analizi
                        </h3>
                    </div>
                    <span className="relative z-10 text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">
                        {currentQuestionIndex + 1} / {QUESTIONS.length}
                    </span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden border border-white/5">
                    <div
                        className="h-full bg-gradient-to-r from-purple-600 to-blue-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                        style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question Shell */}
            <div className={`transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] transform ${isTransitioning ? 'opacity-0 -translate-y-8 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-16 tracking-tighter leading-[1.1] drop-shadow-2xl">
                    {currentQuestion.text}
                </h1>

                <div className="grid gap-5">
                    {currentQuestion.options.map((option) => (
                        <OptionCard
                            key={option.text}
                            option={option}
                            isSelected={answers[currentQuestion.id] === option.value}
                            onSelect={handleOptionSelect}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
