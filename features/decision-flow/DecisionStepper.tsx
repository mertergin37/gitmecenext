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
    const { currentQuestionIndex, setAnswer, nextQuestion, answers } = useDecisionStore();
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Derived state
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const isFinished = currentQuestionIndex >= QUESTIONS.length;

    // Handle completion and routing
    useEffect(() => {
        if (isFinished) {
            // 1. Calculate best match
            const bestDestinationId = findBestMatch(answers);

            // 2. Redirect to result with answers as search params
            const searchParams = new URLSearchParams();
            Object.entries(answers).forEach(([key, value]) => {
                searchParams.append(key, value.toString());
            });

            // Small delay for UX smoothness
            setTimeout(() => {
                router.push(`/result/${bestDestinationId}?${searchParams.toString()}`);
            }, 500);
        }
    }, [isFinished, answers, router]);

    const handleOptionSelect = (value: number) => {
        if (isTransitioning) return;

        setAnswer(currentQuestion.id, value);
        setIsTransitioning(true);

        // Auto-advance after short delay
        setTimeout(() => {
            nextQuestion();
            setIsTransitioning(false);
        }, 400);
    };

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
                            Analiz Aşaması {currentQuestionIndex + 1}
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
