import { AIProvider, AIRequest, AIResponse } from './types';
import { SimulationProvider } from './providers/simulation';
import { GeminiProvider } from './providers/gemini';
import { DestinationInfo } from '@/types/destination';

class AIAdapterService {
    private fallback: AIProvider;

    constructor() {
        this.fallback = new SimulationProvider();
    }

    private getProvider(): AIProvider {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (apiKey && apiKey !== 'your_gemini_api_key_here') {
            return new GeminiProvider();
        }
        return this.fallback;
    }

    async generateDecisionResponse(request: AIRequest): Promise<AIResponse> {
        const provider = this.getProvider();
        try {
            const response = await provider.generate(request);
            console.log(`AI Response generated via ${response.provider}`);
            return response;
        } catch (error) {
            console.error('AI Provider Failed, falling back to Simulation:', error);
            return await this.fallback.generate(request);
        }
    }

    async discoverDestination(destinationId: string): Promise<DestinationInfo> {
        const provider = this.getProvider();
        try {
            return await provider.discover(destinationId);
        } catch (error) {
            console.error('AI Discovery Failed, falling back to Simulation:', error);
            return await this.fallback.discover(destinationId);
        }
    }
}

export const AIAdapter = new AIAdapterService();
