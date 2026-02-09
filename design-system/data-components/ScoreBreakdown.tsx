import React from 'react';
import { ScoreBreakdown as IScoreBreakdown } from '@/types/decision';

interface ScoreBreakdownProps {
    breakdown: IScoreBreakdown;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ breakdown }) => {
    const items = [
        { key: 'season', label: 'Mevsim Uyumu', value: breakdown.season, color: 'from-blue-600 to-blue-400' },
        { key: 'price', label: 'Bütçe Verimliliği', value: breakdown.price, color: 'from-emerald-600 to-emerald-400' },
        { key: 'crowd', label: 'Kalabalık Dengesi', value: breakdown.crowd, color: 'from-purple-600 to-purple-400' },
        { key: 'expectation', label: 'Beklenti Skoru', value: breakdown.expectation, color: 'from-orange-600 to-orange-400' },
        { key: 'risk', label: 'Güven Endeksi', value: breakdown.risk, color: 'from-red-600 to-red-400' },
    ];

    return (
        <div className="rounded-[2rem] bg-white/[0.03] p-10 border border-white/5 backdrop-blur-3xl shadow-2xl animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-6 bg-white/20 rounded-full" />
                <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.3em]">Derin Analiz Raporu</h3>
            </div>

            <div className="space-y-8">
                {items.map((item) => (
                    <div key={item.key} className="group">
                        <div className="flex justify-between items-end mb-3">
                            <span className="text-xs font-black text-white/60 uppercase tracking-widest group-hover:text-white transition-colors">
                                {item.label}
                            </span>
                            <span className="text-lg font-black text-white">%{item.value}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden border border-white/5">
                            <div
                                className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                                style={{ width: `${item.value}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
