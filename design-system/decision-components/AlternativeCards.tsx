"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Wallet, Leaf, Zap } from 'lucide-react';
import { AlternativeRecommendation } from '@/types/decision';

interface AlternativeCardsProps {
    alternatives: AlternativeRecommendation[];
}

const TYPE_CONFIG = {
    cheap: {
        icon: Wallet,
        label: 'Ekonomik',
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/20',
        bgColor: 'bg-emerald-500/10'
    },
    quiet: {
        icon: Leaf,
        label: 'Sakin',
        color: 'text-blue-400',
        borderColor: 'border-blue-500/20',
        bgColor: 'bg-blue-500/10'
    },
    vibe: {
        icon: Zap,
        label: 'Aynı Vibe',
        color: 'text-purple-400',
        borderColor: 'border-purple-500/20',
        bgColor: 'bg-purple-500/10'
    }
};

export const AlternativeCards: React.FC<AlternativeCardsProps> = ({ alternatives }) => {
    if (!alternatives || alternatives.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                <h3 className="text-xl font-black tracking-tight text-white/90 uppercase">
                    Senin İçin Alternatif Rotalar
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {alternatives.map((alt) => {
                    const config = TYPE_CONFIG[alt.type];
                    const Icon = config.icon;

                    return (
                        <Link
                            key={alt.id}
                            href={`/result/${alt.id.toLowerCase()}`}
                            className={`group relative p-6 rounded-3xl border ${config.borderColor} bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between h-full overflow-hidden`}
                        >
                            {/* Abstract Ambient Glow */}
                            <div className={`absolute -top-10 -right-10 w-24 h-24 ${config.bgColor} rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />

                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-2 rounded-xl ${config.bgColor} ${config.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="text-[10px] font-black px-2 py-1 rounded-full bg-white/10 text-white/40 uppercase tracking-widest border border-white/5">
                                        %{alt.matchScore} Uyum
                                    </div>
                                </div>

                                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                                    {alt.name}
                                </h4>
                                <p className="text-sm text-white/50 leading-relaxed mb-6">
                                    {alt.reason}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                                    {config.label}
                                </span>
                                <div className="p-2 rounded-full bg-white/5 group-hover:bg-white group-hover:text-black transition-all">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
