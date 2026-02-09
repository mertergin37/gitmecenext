export type VerdictType = 'git' | 'gitme' | 'sinirda';

export interface UserProfile {
    [questionId: string]: number;
}

export interface Option {
    text: string;
    value: number;
}

export interface Question {
    id: string;
    text: string;
    options: Option[];
    weight: number;
}

export interface ScoreBreakdown {
    season: number;
    price: number;
    crowd: number;
    expectation: number;
    risk: number;
}

export interface AlternativeRecommendation {
    id: string;
    name: string;
    type: 'cheap' | 'quiet' | 'vibe';
    reason: string;
    matchScore: number;
}

export interface DecisionResult {
    destinationId: string;
    matchScore: number;
    verdict: VerdictType;
    breakdown: ScoreBreakdown;
    penalties: string[];
    alternatives?: AlternativeRecommendation[];
}
