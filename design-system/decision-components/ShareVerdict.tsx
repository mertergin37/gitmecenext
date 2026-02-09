"use client";

import React from 'react';
import { Twitter, Send, Share2 } from 'lucide-react';
import { DecisionResult } from '@/types/decision';
import { Destination } from '@/types/destination';

interface ShareVerdictProps {
    result: DecisionResult;
    destination: Destination;
}

export const ShareVerdict: React.FC<ShareVerdictProps> = ({ result, destination }) => {
    const score = result.matchScore;
    const destName = destination.name;

    const getShareText = () => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://gitmece.com';
        const resultUrl = `${baseUrl}/result/${destination.id.toLowerCase()}`;

        if (result.verdict === 'git') {
            return {
                title: `Bana ${destName} için %${score} GİT çıktı! ✈️`,
                text: `Gitmece algoritması ${destName} için %${score} uyum buldu. "Kesin gitmelisin" diyor! Senin rotan neresi?`,
                url: resultUrl
            };
        } else if (result.verdict === 'gitme') {
            return {
                title: `${destName} için %${score} ile GİTME kararı çıktı... 🛑`,
                text: `Gitmece verilerine göre ${destName} şu an bana uygun değilmiş. %${score} uyumda kaldık. Algoritmayı sen de dene!`,
                url: resultUrl
            };
        } else {
            return {
                title: `${destName} kararım sınıra takıldı! 🤔`,
                text: `Gitmece %${score} ile "Sinirda" kararı verdi. Riskler ve fırsatlar kafa kafaya. Sen ne dersin?`,
                url: resultUrl
            };
        }
    };

    const shareData = getShareText();

    const handleShareX = () => {
        const text = `${shareData.title}\n\n${shareData.text}\n\n`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareData.url)}`;
        window.open(url, '_blank');
    };

    const handleShareWA = () => {
        const text = `*${shareData.title}*\n\n${shareData.text}\n\n${shareData.url}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="flex gap-4 w-full">
            <button
                onClick={handleShareX}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl border border-white/10 transition-all group"
            >
                <Twitter className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                <span>X'te Paylaş</span>
            </button>
            <button
                onClick={handleShareWA}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold py-4 rounded-xl border border-emerald-500/20 transition-all group"
            >
                <Send className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>WhatsApp</span>
            </button>
        </div>
    );
};
