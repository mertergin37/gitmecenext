import { DecisionResult, UserProfile } from '@/types/decision';
import { Destination } from '@/types/destination';

export interface AIRequest {
    destination: Destination;
    decision: DecisionResult;
    profile: UserProfile;
}

export interface AIResponse {
    summary: string;
    pros: string[];
    cons: string[];
    tone: 'positive' | 'neutral' | 'negative' | 'caution';
    provider: 'groq' | 'together' | 'ollama' | 'simulation';
}

export interface AIProvider {
    generate(request: AIRequest): Promise<AIResponse>;
}
