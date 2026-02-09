import React from 'react';
import { clsx } from 'clsx';
import { Option } from '@/types/decision';

interface OptionCardProps {
    option: Option;
    isSelected: boolean;
    onSelect: (value: number) => void;
}

export const OptionCard: React.FC<OptionCardProps> = ({ option, isSelected, onSelect }) => {
    return (
        <button
            onClick={() => onSelect(option.value)}
            className={clsx(
                "w-full text-left p-8 rounded-[2rem] border transition-all duration-500 group relative overflow-hidden backdrop-blur-md",
                isSelected
                    ? "bg-white text-black border-white shadow-[0_20px_40px_rgba(255,255,255,0.15)] scale-[1.02]"
                    : "bg-white/[0.03] text-white border-white/5 hover:bg-white/[0.07] hover:border-white/10 hover:translate-x-1"
            )}
        >
            <div className="relative z-10 flex justify-between items-center">
                <span className={clsx(
                    "text-xl tracking-tight transition-all duration-300",
                    isSelected ? "font-black" : "font-bold text-white/60 group-hover:text-white"
                )}>
                    {option.text}
                </span>

                {/* Selection Indicator */}
                <div className={clsx(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                    isSelected
                        ? "border-black bg-black scale-110 rotate-[360deg]"
                        : "border-white/10 group-hover:border-white/30"
                )}>
                    {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    )}
                </div>
            </div>

            {/* Hover/Active Glow */}
            {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            )}
        </button>
    );
};
