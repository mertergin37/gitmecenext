import { ScoreBreakdown } from '@/types/decision';

export interface Personality {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    bgColor: string;
    borderColor: string;
}

export const PERSONALITIES: Record<string, Personality> = {
    LUXURY: {
        id: 'LUXURY',
        title: 'Lüks Tutkunu',
        description: 'Konfor ve kalite senin için vazgeçilmez. En iyi deneyimi yaşamak için bütçeni zorlamaktan çekinmiyorsun.',
        icon: 'Crown',
        color: 'text-amber-400',
        bgColor: 'bg-amber-400/10',
        borderColor: 'border-amber-400/20'
    },
    ZEN: {
        id: 'ZEN',
        title: 'Sakinlik Arayan',
        description: 'Kalabalıklar sana göre değil. Ruhunu dinlendirebileceğin, sessiz ve huzurlu rotalar senin ilk tercihin.',
        icon: 'Leaf',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-400/10',
        borderColor: 'border-emerald-400/20'
    },
    CULTURE: {
        id: 'CULTURE',
        title: 'Kültür Kaşifi',
        description: 'Gittiğin yerin hikayesi olmalı. Müzeler, tarihi yapılar ve yerel doku senin için her şeyden daha önemli.',
        icon: 'Compass',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        borderColor: 'border-blue-400/20'
    },
    BUDGET: {
        id: 'BUDGET',
        title: 'Ekonomi Savaşçısı',
        description: 'Maksimum macera, minimum maliyet! Paranın karşılığını en iyi veren rotaları bulmakta üstüne yok.',
        icon: 'Wallet',
        color: 'text-purple-400',
        bgColor: 'bg-purple-400/10',
        borderColor: 'border-purple-400/20'
    },
    ADVENTURER: {
        id: 'ADVENTURER',
        title: 'Kaos ve Macera',
        description: 'Sıradanlık sana göre değil. Değişken hava koşulları ve plansız rotalar seni her zaman daha çok heyecanlandırıyor.',
        icon: 'Zap',
        color: 'text-orange-400',
        bgColor: 'bg-orange-400/10',
        borderColor: 'border-orange-400/20'
    }
};

export function analyzeTravelPersonality(history: any[]): Personality | null {
    if (!history || history.length < 3) return null;

    // Averages calculate
    const averages = {
        price: 0,
        crowd: 0,
        expectation: 0,
        risk: 0
    };

    history.forEach(item => {
        const b = item.breakdown as ScoreBreakdown;
        averages.price += b.price;
        averages.crowd += b.crowd;
        averages.expectation += b.expectation;
        averages.risk += b.risk;
    });

    const count = history.length;
    const avgPrice = averages.price / count;
    const avgCrowd = averages.crowd / count;
    const avgExpect = averages.expectation / count;
    const avgRisk = averages.risk / count;

    // Logic for Personality mapping
    // Note: Since 'price' score is high when user matches their budget, we look at the choices.
    // However, we can use the relative weights or specific identifiers if we had UserProfile stored.
    // For now, we use a heuristic based on the scores of the places they GOT 'GİT' for.

    const positiveDecisions = history.filter(h => h.verdict === 'git');

    // Default to Culture Hunter as it's the most common for balanced travelers
    let bestMatch = PERSONALITIES.CULTURE;

    if (avgExpect > 80) bestMatch = PERSONALITIES.LUXURY;
    if (avgCrowd > 75) bestMatch = PERSONALITIES.ZEN;
    if (avgRisk < 50) bestMatch = PERSONALITIES.ADVENTURER;
    if (avgPrice > 85 && avgExpect < 60) bestMatch = PERSONALITIES.BUDGET;

    return bestMatch;
}
