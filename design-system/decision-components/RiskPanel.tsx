import React from 'react';
import { AlertTriangle, ShieldAlert, CloudRain, Wallet } from 'lucide-react';
import { DecisionResult } from '@/types/decision';

interface RiskPanelProps {
    penalties: string[];
}

export const RiskPanel: React.FC<RiskPanelProps> = ({ penalties }) => {
    if (penalties.length === 0) return null;

    const riskConfig: Record<string, { icon: any, label: string, desc: string }> = {
        'High Security Risk': { icon: ShieldAlert, label: 'Güvenlik Uyarısı', desc: 'Destinasyonda aktif güvenlik riski tespit edildi.' },
        'Off-Season': { icon: CloudRain, label: 'Mevsim Riski', desc: 'Seçilen dönem destinasyonun en verimsiz zamanı.' },
        'Extreme Budget Mismatch': { icon: Wallet, label: 'Bütçe Aşımı', desc: 'Destinasyon maliyeti bütçenizin çok üzerinde.' }
    };

    return (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="text-red-400 w-5 h-5" />
                <h3 className="text-lg font-bold text-red-100">Kritik Uyarılar</h3>
            </div>

            <div className="space-y-3">
                {penalties.map((penalty) => {
                    const config = riskConfig[penalty] || { icon: AlertTriangle, label: penalty, desc: 'Dikkat edilmesi gereken durum.' };
                    const Icon = config.icon;

                    return (
                        <div key={penalty} className="flex gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/10">
                            <div className="p-2 rounded-lg bg-red-500/20 h-fit">
                                <Icon className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-red-200 text-sm">{config.label}</h4>
                                <p className="text-xs text-red-200/60 mt-1 leading-relaxed">
                                    {config.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
