import { DecisionResult, UserProfile } from '@/types/decision';
import { Destination, DestinationInfo } from '@/types/destination';

export interface AIRequest {
    destination: Destination;
    decision: DecisionResult;
    profile: UserProfile;
    month?: number;
}

export interface AIResponse {
    summary: string;
    pros: string[];
    cons: string[];
    verdict: 'git' | 'gitme' | 'sinirda';
    matchScore: number;
    alternatives?: {
        name: string;
        reason: string;
        matchScore: number;
    }[];
    tone: 'positive' | 'neutral' | 'negative' | 'caution';
    provider: 'groq' | 'together' | 'ollama' | 'simulation' | 'gemini';
}

export interface AIProvider {
    generate(request: AIRequest): Promise<AIResponse>;
    discover(destinationId: string): Promise<DestinationInfo>;
}
