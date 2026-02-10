import { AIProvider, AIRequest, AIResponse } from '../types';
import { DestinationInfo } from '@/types/destination';

export class SimulationProvider implements AIProvider {
    async generate(request: AIRequest): Promise<AIResponse> {
        // ... (existing simulation code could go here, but omitted for brevity as per existing file)
        const keyStatus = process.env.NEXT_PUBLIC_GEMINI_API_KEY ? "Detected" : "Missing";
        return {
            summary: `Simülasyon Aktif (Key Status: ${keyStatus}). Bu bir örnek değerlendirmedir.`,
            pros: ["Hızlı Yanıt", "Düşük Gecikme", "Sıfır Maliyet"],
            cons: ["Gerçek Veri Değil", "Sınırlı Analiz", "Statik Sonuç"],
            verdict: 'sinirda',
            matchScore: 65,
            alternatives: [
                { name: 'Antalya', reason: 'Dengeli seçenek', matchScore: 80 },
                { name: 'İstanbul', reason: 'Kültürel zenginlik', matchScore: 75 }
            ],
            tone: 'neutral',
            provider: 'simulation'
        };
    }

    async discover(destinationId: string): Promise<DestinationInfo> {
        // Static mock data for common cities if Gemini fails
        return {
            ideal: [5, 6, 9],
            medium: [4, 10],
            poor: [1, 2, 3, 7, 8, 11, 12],
            priceLevel: 3,
            crowdLevel: 3,
            categories: { entertainment: 50, peace: 50, nature: 50, luxury: 50, culture: 50 },
            risks: { weather: 5, scam: 5, trap: 5, cancel: 5, safety: 5 }
        };
    }
}
