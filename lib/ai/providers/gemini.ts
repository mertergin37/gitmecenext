import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIProvider, AIRequest, AIResponse } from '../types';

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
        const { destination, decision, profile } = request;
        const { matchScore, verdict } = decision;

        const prompt = `
            Sen bir seyahat danışmanısın. Kullanıcının bir destinasyon için yaptığı analizi yorumlayacaksın.
            
            Destinasyon: ${destination.name}
            Uyum Skoru: %${matchScore}
            Karar: ${verdict.toUpperCase()} (GIT, SINIRDA veya GITME)
            
            Kullanıcı Profili:
            - Bütçe: ${profile.budget}/5 (1: Ekonomik, 5: Lüks)
            - Kalabalık Toleransı: ${profile.crowd}/5 (1: Sakin, 5: Kalabalık)
            - Konfor Beklentisi: ${profile.experience}/5 (1: Maceracı, 5: Lüks)

            Senden şu formatta bir JSON yanıtı bekliyorum:
            {
                "summary": "Destinasyon ve kullanıcı uyumu hakkında 2-3 cümlelik vurucu bir özet.",
                "pros": ["Öne çıkan 3 avantaj"],
                "cons": ["Dikkat edilmesi gereken 3 dezavantaj veya risk"],
                "tone": "positive" | "neutral" | "negative" | "caution"
            }

            Yanıt dili Türkçe olmalıdır. "tone" alanını skor ve karara göre seç.
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
                tone: data.tone || this.getTone(matchScore),
                provider: 'simulation' // We can update types later to include 'gemini'
            } as any;
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
}
