import { DESTINATION_DATA } from '@/features/decision-flow/config/destinations';
import { calculateScore } from '@/lib/decision-engine/scoring';
import { AIAdapter } from '@/lib/ai/adapter';
import { VerdictHero } from '@/design-system/decision-components/VerdictHero';
import { ScoreBreakdown } from '@/design-system/data-components/ScoreBreakdown';
import { RiskPanel } from '@/design-system/decision-components/RiskPanel';
import { Header } from '@/components/layout/Header';
import { AlternativeCards } from '@/design-system/decision-components/AlternativeCards';
import { ShareVerdict } from '@/design-system/decision-components/ShareVerdict';
import { UserProfile } from '@/types/decision';
import { HistoryService } from '@/services/history.service';
import { supabase } from '@/lib/supabase';
import { UnsplashService } from '@/lib/images/unsplash';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// MOCK PROFILE FOR DEMO (Since we don't have the questionnaire state yet)
const MOCK_PROFILE: UserProfile = {
    budget: 1, // Ekonomik
    crowd: 1, // Sakin
    purpose: 1, // Mental Dinlenme
    weather: 1, // Hassas
    experience: 3 // Standart
};

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResultPage({ params, searchParams }: PageProps) {
    // 1. Data Fetching
    const { id } = await params;
    const sParams = await searchParams;

    // Convert searchParams to UserProfile
    const userProfile: UserProfile = {
        budget: Number(sParams.budget) || 3,
        crowd: Number(sParams.crowd) || 3,
        purpose: Number(sParams.purpose) || 3,
        weather: Number(sParams.weather) || 3,
        experience: Number(sParams.experience) || 3
    };

    const destinationId = id; // Keep original for AI (could be "Paris" or "KAPADOKYA")
    let destinationInfo = DESTINATION_DATA[destinationId.toUpperCase()];
    let isDynamic = false;

    // AI Dynamic Discovery for ANY city not in our static config
    if (!destinationInfo) {
        try {
            destinationInfo = await AIAdapter.discoverDestination(destinationId);
            isDynamic = true;
        } catch (error) {
            console.error('Dynamic Discovery Failed:', error);
        }
    }

    // 404 Handling (Only if discovery also fails)
    if (!destinationInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <h1 className="text-6xl font-black mb-4">404</h1>
                    <p className="text-white/40 uppercase tracking-widest text-xs">Destinasyon Analiz Edilemedi</p>
                    <a href="/" className="mt-8 inline-block px-8 py-3 bg-white text-black font-black rounded-xl">Geri Dön</a>
                </div>
            </div>
        );
    }

    const destination = {
        id: destinationId,
        name: decodeURIComponent(destinationId).split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
        data: destinationInfo
    };

    const month = sParams.month ? Number(sParams.month) : undefined;

    // ... (rest of destination discovery logic)

    // 2. Engine Execution
    const decisionResult = calculateScore(destination, userProfile);

    // 3. AI Analysis & Image Fetching (Parallel)
    const [aiResponse, destinationImage] = await Promise.all([
        AIAdapter.generateDecisionResponse({
            destination,
            decision: decisionResult,
            profile: userProfile,
            month: month
        }),
        UnsplashService.searchDestinationImage(destination.name)
    ]);

    // Override mathematical result with AI-driven result for the final verdict
    const finalResult = {
        ...decisionResult,
        verdict: aiResponse.verdict,
        matchScore: aiResponse.matchScore,
        alternatives: aiResponse.alternatives
            ? aiResponse.alternatives.map((alt) => ({
                id: alt.name.toLowerCase().replace(/\s+/g, '-'),
                name: alt.name,
                type: 'vibe' as const, // Default to vibe for AI suggestions
                reason: alt.reason,
                matchScore: alt.matchScore
            }))
            : decisionResult.alternatives
    };

    // 4. Persistence (Auto-save if user is logged in)
    let savedDecisionId: string | null = null;
    if (supabase) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const saved = await HistoryService.saveDecision(user.id, destination, finalResult);
                if (saved) {
                    savedDecisionId = (saved as any).id;
                }
            }
        } catch (e) {
            console.warn('Failed to auto-save decision:', e);
        }
    }

    // 5. UI Rendering
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 relative">
            {/* Dynamic Background Image */}
            {destinationImage && (
                <>
                    <div
                        className="fixed inset-0 z-0 bg-cover bg-center opacity-30 saturate-0 hover:saturate-50 transition-all duration-1000"
                        style={{ backgroundImage: `url(${destinationImage.url})` }}
                    />
                    <div className="fixed inset-0 z-1 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
                </>
            )}

            <div className="max-w-4xl mx-auto space-y-8 relative z-10">

                {/* Header */}
                <Header />

                {/* L3 Decision Components */}
                <VerdictHero
                    result={finalResult}
                    destination={destination}
                    savedDecisionId={savedDecisionId}
                />

                {/* Grid Layout for Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* L2 Data Component */}
                    <ScoreBreakdown breakdown={decisionResult.breakdown} />

                    <div className="space-y-6">
                        {/* L3 Decision Component (Risk) */}
                        <RiskPanel penalties={decisionResult.penalties} />

                        {/* Context/Summary Placeholder */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                            <h3 className="font-bold mb-2 text-white/90">Yapay Zeka Özeti</h3>
                            <p className="text-sm text-white/60 leading-relaxed mb-4">
                                {aiResponse.summary}
                            </p>

                            {/* Pros/Cons from AI */}
                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                                <div>
                                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Avantajlar</h4>
                                    <ul className="text-xs text-white/60 space-y-1">
                                        {aiResponse.pros.map((p, i) => <li key={i}>• {p}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Dezavantajlar</h4>
                                    <ul className="text-xs text-white/60 space-y-1">
                                        {aiResponse.cons.map((c, i) => <li key={i}>• {c}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-50">
                    <div className="max-w-4xl mx-auto flex gap-4 pointer-events-auto">
                        <button className="flex-1 bg-white text-black font-bold py-4 rounded-xl hover:bg-white/90 transition-colors shadow-xl shadow-white/5">
                            Planı Kaydet
                        </button>
                        <div className="flex-1">
                            <ShareVerdict result={decisionResult} destination={destination} />
                        </div>
                    </div>
                </div>

                {/* L3 Alternative Recommendations */}
                <AlternativeCards alternatives={finalResult.alternatives || []} />

                {/* Attribution */}
                {destinationImage && (
                    <div className="flex justify-center pb-8">
                        <p className="text-[10px] text-white/20 uppercase tracking-widest">
                            Fotoğraf: <a href={destinationImage.photographer.link} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{destinationImage.photographer.name}</a> / Unsplash
                        </p>
                    </div>
                )}

                {/* Bottom Spacer */}
                <div className="h-24" />
            </div>
        </main>
    );
}
