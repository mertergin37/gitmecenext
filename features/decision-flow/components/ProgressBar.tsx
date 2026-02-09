import React from 'react';

interface ProgressBarProps {
    current: number;
    total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
    const progress = Math.min(((current + 1) / total) * 100, 100);

    return (
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-8">
            <div
                className="h-full bg-white transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};
