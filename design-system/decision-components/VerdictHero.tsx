"use client";

import React, { useState } from 'react';
import { DecisionResult } from '@/types/decision';
import { Destination } from '@/types/destination';
import { CheckCircle, AlertTriangle, XCircle, Heart } from 'lucide-react';
import { HistoryService } from '@/services/history.service';

interface VerdictHeroProps {
    result: DecisionResult;
    destination: Destination;
    savedDecisionId?: string | null;
}

export const VerdictHero: React.FC<VerdictHeroProps> = ({ result, destination, savedDecisionId }) => {
    const { verdict, matchScore } = result;
    const [isFavorite, setIsFavorite] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const config = {
        git: {
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            icon: CheckCircle,
            text: 'GİT (KESİN ONAY)',
            desc: 'Stratejik Olarak Uygun'
        },
        sinirda: {
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20',
            icon: AlertTriangle,
            text: 'BİR DAHA DÜŞÜN',
            desc: 'Limitlerde Analiz'
        },
        gitme: {
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            icon: XCircle,
            text: 'GİTME (KRİTİK ENGEL)',
            desc: 'Ertelenmesi Gereken Rota'
        }
    }[verdict];

    const Icon = config.icon;

    const handleToggleFavorite = async () => {
        if (!savedDecisionId || isUpdating) return;

        setIsUpdating(true);
        try {
            await HistoryService.toggleFavorite(savedDecisionId, !isFavorite);
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className={`relative overflow-hidden rounded-[2.5rem] border ${config.border} ${config.bg} p-12 text-center backdrop-blur-2xl animate-fade-in-up shadow-2xl group`}>
            {/* Favorite Button (Only if saved) */}
            {savedDecisionId && (
                <button
                    onClick={handleToggleFavorite}
                    disabled={isUpdating}
                    className={`absolute top-8 right-8 p-4 rounded-2xl border transition-all z-20 ${isFavorite
                            ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20'
                            : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                >
                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
            )}

            {/* Background Mesh Glow */}
            <div className={`absolute -top-20 -left-20 h-80 w-80 rounded-full ${config.bg} blur-[120px] opacity-40 animate-pulse-glow`} />
            <div className={`absolute -bottom-20 -right-20 h-80 w-80 rounded-full ${config.bg} blur-[120px] opacity-40 animate-pulse-glow`} />

            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className={`flex items-center gap-2 rounded-full border ${config.border} bg-black/40 px-6 py-2 shadow-inner animate-fade-in-up`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                    <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${config.color}`}>{config.text}</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter animate-fade-in-up delay-100 leading-tight">
                    {destination.name}
                </h1>

                <p className="text-lg md:text-xl text-white/40 font-bold uppercase tracking-widest animate-fade-in-up delay-200">
                    {config.desc}
                </p>

                <div className="mt-8 flex flex-col items-center gap-2 animate-fade-in-up delay-300">
                    <span className={`text-8xl md:text-9xl font-black tracking-tighter leading-none ${config.color} drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]`}>
                        %{matchScore}
                    </span>
                    <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mt-4">
                        Algoritmik Uyum Skoru
                    </span>
                </div>
            </div>
        </div>
    );
};
