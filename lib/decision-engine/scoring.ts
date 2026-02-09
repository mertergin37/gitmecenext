import { Destination } from '@/types/destination';
import { UserProfile, DecisionResult, VerdictType } from '@/types/decision';
import { DESTINATION_DATA } from '@/features/decision-flow/config/destinations';
import { AlternativeRecommendation } from '@/types/decision';

export function findBestMatch(userProfile: UserProfile): string {
    let bestScore = -1;
    let bestId = 'KAPADOKYA'; // Default fallback

    Object.entries(DESTINATION_DATA).forEach(([id, info]) => {
        const destination: Destination = { id, name: id, data: info };
        const result = calculateScore(destination, userProfile);

        if (result.matchScore > bestScore) {
            bestScore = result.matchScore;
            bestId = id;
        }
    });

    return bestId;
}

export function calculateScore(
    destination: Destination,
    userProfile: UserProfile,
    currentMonth: number = new Date().getMonth() + 1,
    includeAlternatives: boolean = true
): DecisionResult {
    const { data } = destination;
    const answers = userProfile;

    // --- 1. Season Scoring ---
    let sSeason = 50;
    let seasonType: 'ideal' | 'medium' | 'poor' = 'medium';

    if (data.ideal.includes(currentMonth)) {
        sSeason = 100;
        seasonType = 'ideal';
    } else if (data.poor.includes(currentMonth)) {
        sSeason = 25;
        seasonType = 'poor';
    } else {
        sSeason = 65;
        seasonType = 'medium';
    }

    // Weather Sensitivity Factor (User value 1 is highest sensitivity)
    if (answers['weather'] === 1 && seasonType === 'poor') {
        sSeason = Math.max(0, sSeason - 15);
    }

    // --- 2. Price Scoring ---
    let sPrice = 55;
    const destPrice = data.priceLevel;
    const userBudget = answers['budget'] || 3;
    const priceDiff = Math.abs(destPrice - userBudget);
    const priceScores = [100, 80, 55, 30, 10];
    sPrice = priceScores[priceDiff] || 10;

    // --- 3. Crowd Scoring ---
    let sCrowd = 50;
    const destCrowd = data.crowdLevel;
    const userTolerance = answers['crowd'] || 3;
    const crowdDiff = Math.abs(destCrowd - userTolerance);
    sCrowd = 100 - (crowdDiff * 20);

    // --- 4. Expectation Scoring ---
    let sExpect = 50;
    const cats = data.categories;
    const purpose = answers['purpose'] || 3;
    const experience = answers['experience'] || 3;

    // Priority Mapping
    let priorities: number[] = [];
    if (purpose === 1) priorities.push(cats.peace, cats.nature); // Mental Dinlenme
    else if (purpose === 3) priorities.push(cats.culture); // Kültürel Keşif
    else if (purpose === 5) priorities.push(cats.entertainment); // Sosyal Aktivite

    if (experience === 5) priorities.push(cats.luxury); // Lüks beklentisi

    if (priorities.length > 0) {
        sExpect = priorities.reduce((a, b) => a + b, 0) / priorities.length;
    }

    // --- 5. Risk Scoring ---
    let sRisk = 75;
    const r = data.risks;
    const totalRisk = r.weather + r.scam + r.trap + r.cancel + r.safety;
    sRisk = Math.max(0, 100 - totalRisk);

    // --- Final Calculation ---
    const baseScore =
        sSeason * 0.2 + sPrice * 0.2 + sCrowd * 0.15 + sExpect * 0.3 + sRisk * 0.15;

    // --- Penalties ---
    let penalty = 0;
    const penalties: string[] = [];

    if (data.risks.safety >= 15) {
        penalty += 20;
        penalties.push('High Security Risk');
    }
    if (seasonType === 'poor') {
        penalty += 15;
        penalties.push('Off-Season');
    }
    if (priceDiff >= 3) {
        penalty += 15;
        penalties.push('Extreme Budget Mismatch');
    }

    const matchScore = Math.round(Math.max(0, baseScore - penalty));

    // --- Verdict ---
    let verdict: VerdictType = 'gitme';
    if (matchScore >= 80) verdict = 'git';
    else if (matchScore >= 60) verdict = 'sinirda';

    return {
        destinationId: destination.id,
        matchScore,
        verdict,
        breakdown: {
            season: Math.round(sSeason),
            price: Math.round(sPrice),
            crowd: Math.round(sCrowd),
            expectation: Math.round(sExpect),
            risk: Math.round(sRisk),
        },
        penalties,
        alternatives: includeAlternatives ? findAlternatives(destination.id, userProfile) : []
    };
}

function findAlternatives(currentId: string, userProfile: UserProfile): AlternativeRecommendation[] {
    const currentData = DESTINATION_DATA[currentId];
    if (!currentData) return [];

    const alternatives: AlternativeRecommendation[] = [];
    const allDestinations = Object.entries(DESTINATION_DATA)
        .filter(([id]) => id !== currentId)
        .map(([id, info]) => ({
            id,
            info,
            result: calculateScore({ id, name: id, data: info }, userProfile, new Date().getMonth() + 1, false)
        }))
        .sort((a, b) => b.result.matchScore - a.result.matchScore);

    // 1. Cheap Alternative
    const cheap = allDestinations.find(d => d.info.priceLevel < currentData.priceLevel);
    if (cheap) {
        alternatives.push({
            id: cheap.id,
            name: cheap.id.charAt(0) + cheap.id.slice(1).toLowerCase(),
            type: 'cheap',
            reason: 'Daha ekonomik bir deneyim',
            matchScore: cheap.result.matchScore
        });
    }

    // 2. Quiet Alternative
    const quiet = allDestinations.find(d => d.info.crowdLevel < currentData.crowdLevel);
    if (quiet) {
        alternatives.push({
            id: quiet.id,
            name: quiet.id.charAt(0) + quiet.id.slice(1).toLowerCase(),
            type: 'quiet',
            reason: 'Daha sakin ve huzurlu',
            matchScore: quiet.result.matchScore
        });
    }

    // 3. Similar Vibe (Best match that isn't already included)
    const vibe = allDestinations.find(d => !alternatives.find(a => a.id === d.id));
    if (vibe) {
        alternatives.push({
            id: vibe.id,
            name: vibe.id.charAt(0) + vibe.id.slice(1).toLowerCase(),
            type: 'vibe',
            reason: 'Benzer atmosfer, farklı keşif',
            matchScore: vibe.result.matchScore
        });
    }

    return alternatives;
}
