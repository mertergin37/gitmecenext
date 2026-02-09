export interface CategoryData {
    entertainment: number;
    peace: number;
    nature: number;
    luxury: number;
    culture: number;
}

export interface RiskData {
    weather: number;
    scam: number;
    trap: number;
    cancel: number;
    safety: number;
}

export interface DestinationInfo {
    ideal: number[]; // Months (1-12)
    medium: number[];
    poor: number[];
    priceLevel: number; // 1-5
    crowdLevel: number; // 1-5
    categories: CategoryData;
    risks: RiskData;
}

export interface Destination {
    id: string; // e.g. 'KAPADOKYA'
    name: string; // Display name
    data: DestinationInfo;
}
