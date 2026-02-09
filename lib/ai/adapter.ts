import { AIProvider, AIRequest, AIResponse } from './types';
import { SimulationProvider } from './providers/simulation';
import { GeminiProvider } from './providers/gemini';

class AIAdapterService {
    private provider: AIProvider;
    private fallback: AIProvider;

    constructor() {
        this.fallback = new SimulationProvider();

        // Use Gemini if API key is present
        if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
            this.provider = new GeminiProvider();
        } else {
            console.warn('Gemini API Key missing. Falling back to simulation mode.');
            this.provider = this.fallback;
        }
    }

    async generateDecisionResponse(request: AIRequest): Promise<AIResponse> {
        try {
            return await this.provider.generate(request);
        } catch (error) {
            console.error('Gemini Provider Failed, falling back to Simulation:', error);
            return await this.fallback.generate(request);
        }
    }
}

export const AIAdapter = new AIAdapterService();
