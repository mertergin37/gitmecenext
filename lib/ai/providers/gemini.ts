import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIProvider, AIRequest, AIResponse } from '../types';
import { DestinationInfo } from '@/types/destination';

export class GeminiProvider implements AIProvider {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });
    }

    async generate(request: AIRequest): Promise<AIResponse> {
        const { destination, profile } = request;

        const prompt = `
            Sen profesyonel ve dürüst bir seyahat stratejistisin. Görevin, kullanıcının seçtiği destinasyonu (Şehir) ve verdiği yanıtları analiz edip GİT ya da GİTME kararı vermektir.
            
            Destinasyon: ${destination.name}
            Destinasyon Teknik Verileri (Referans): ${JSON.stringify(destination.data)}
            
            Kullanıcı Tercihleri (1-5 arası):
            - Bütçe: ${profile.budget} (1: Ekonomik, 5: Lüks)
            - Kalabalık Toleransı: ${profile.crowd} (1: Sakin, 5: Kalabalık)
            - Beklenti: ${profile.purpose} (1: Dinlenme, 3: Kültür, 5: Aktivite)
            - Konfor Seviyesi: ${profile.experience} (1: Macera, 5: Lüks)
            - Planlanan Ay: ${request.month ? `${request.month}. ay` : 'Belirtilmedi (Genel analiz yap)'}

            Analiz Kriterleri:
            1. Eğer bütçe (profile.budget) destinasyonun priceLevel'ından çok düşükse (örn: bütçe 1, price 4), bu büyük bir eksi puandır.
            2. Eğer kalabalık toleransı düşükse ve destinasyon çok kalabalıksa, bu bir "GİTME" sebebidir.
            3. Mevsimsel uyumu (ideal aylar) ${request.month ? `özellikle ${request.month}. ay` : 'genel mevsimler'} için kontrol et. Seçilen ay "poor" kategorisindeyse mutlaka belirt.

            Senden şu formatta bir JSON yanıtı bekliyorum (SADECE JSON):
            {
                "verdict": "git" | "gitme" | "sinirda",
                "matchScore": 0-100 arası bir tam sayı,
                "summary": "Neden bu kararı verdiğini açıklayan 2 cümlelik, dürüst ve vurucu bir özet.",
                "pros": ["Kullanıcı için 3 avantaj"],
                "cons": ["Kullanıcı için en kritik 3 risk veya dezavantaj"],
                "tone": "positive" | "neutral" | "negative" | "caution",
                "alternatives": [
                    { "name": "Şehir Adı", "reason": "Neden daha iyi bir seçenek?", "matchScore": 85 }
                ] (Eğer "gitme" veya "sinirda" ise mutlaka 2-3 alternatif öner, kullanıcıya daha uygun şehirleri seç)
            }

            Yanıt dili tamamen Türkçe olmalıdır. "Pazarlama" ağzıyla konuşma, dürüst ve analitik ol.
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const data = JSON.parse(text);

            return {
                summary: data.summary,
                pros: data.pros,
                cons: data.cons,
                verdict: data.verdict,
                matchScore: data.matchScore,
                alternatives: data.alternatives,
                tone: data.tone || this.getTone(data.matchScore),
                provider: 'gemini'
            };
        } catch (error) {
            console.error("Gemini API Error:", error);
            throw error;
        }
    }

    private getTone(score: number): 'positive' | 'neutral' | 'negative' | 'caution' {
        if (score >= 80) return 'positive';
        if (score >= 60) return 'caution';
        if (score >= 40) return 'neutral';
        return 'negative';
    }

    async discover(destinationId: string): Promise<DestinationInfo> {
        const prompt = `
            Sen bir seyahat veri uzmanısın. Belirtilen lokasyon için Gitmece analiz motoruna uygun teknik veriler üreteceksin.
            Lokasyon: ${destinationId}

            Senden şu JSON formatında yanıt bekliyorum (SADECE JSON):
            {
                "ideal": [İdeal aylar, örn: [4, 5, 9]],
                "medium": [Orta aylar, örn: [3, 10]],
                "poor": [Kötü aylar, örn: [1, 2, 7, 8, 12]],
                "priceLevel": 1-5 arası tam sayı (1: Çok Ucuz, 5: Çok Pahalı),
                "crowdLevel": 1-5 arası tam sayı (1: Çok Tenha, 5: Çok Kalabalık),
                "categories": {
                    "entertainment": 0-100 arası,
                    "peace": 0-100 arası,
                    "nature": 0-100 arası,
                    "luxury": 0-100 arası,
                    "culture": 0-100 arası
                },
                "risks": {
                    "weather": 0-20 arası,
                    "scam": 0-20 arası,
                    "trap": 0-20 arası,
                    "cancel": 0-20 arası,
                    "safety": 0-20 arası
                }
            }

            Veriler gerçekçi ve lokasyona özgü olmalıdır. Aylar 1 (Ocak) ile 12 (Aralık) arasıdır. 
            Antalya gibi çok sıcak yerler için Temmuz/Ağustos aylarını "poor" kategorisine koy.
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return JSON.parse(text) as DestinationInfo;
        } catch (error) {
            console.error("Gemini Discovery Error:", error);
            throw error;
        }
    }
}
