import React from 'react';

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="relative w-10 h-10 flex items-center justify-center">
                {/* Main Background Diamond - Represents Data/Algorithm */}
                <div className="absolute inset-0 bg-white/10 rotate-45 rounded-lg border border-white/20 backdrop-blur-sm" />

                {/* Animated Inner Diamond */}
                <div className="absolute w-6 h-6 bg-gradient-to-br from-emerald-400 to-blue-500 rotate-45 rounded-sm opacity-80 blur-[1px] animate-pulse" />

                {/* The "Needle" - Represents Decision/Travel */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="relative z-10 w-5 h-5 text-white"
                >
                    <path d="M12 2L19 21L12 17L5 21L12 2Z" />
                </svg>

                {/* Outer Orbitals - Represents Nodes/Complexity */}
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 blur-[0.5px]" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-blue-400 blur-[0.5px]" />
            </div>

            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                gitmece.
            </span>
        </div>
    );
};
