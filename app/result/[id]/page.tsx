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

    const destinationId = id.toUpperCase();
    const destinationInfo = DESTINATION_DATA[destinationId];

    // 404 Handling
    if (!destinationInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-white/60">Destinasyon bulunamadı.</p>
                </div>
            </div>
        );
    }

    const destination = {
        id: destinationId,
        name: destinationId.charAt(0) + destinationId.slice(1).toLowerCase(), // Capitalize
        data: destinationInfo
    };

    // 2. Engine Execution
    const decisionResult = calculateScore(destination, userProfile);

    // 3. AI Analysis (Simulation Layer)
    const aiResponse = await AIAdapter.generateDecisionResponse({
        destination,
        decision: decisionResult,
        profile: userProfile
    });

    // 4. Persistence (Auto-save if user is logged in)
    if (supabase) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await HistoryService.saveDecision(user.id, destination, decisionResult);
            }
        } catch (e) {
            console.warn('Failed to auto-save decision:', e);
        }
    }

    // 5. UI Rendering
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <Header />

                {/* L3 Decision Components */}
                <VerdictHero result={decisionResult} destination={destination} />

                {/* Grid Layout for Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* L2 Data Component */}
                    <ScoreBreakdown breakdown={decisionResult.breakdown} />

                    <div className="space-y-6">
                        {/* L3 Decision Component (Risk) */}
                        <RiskPanel penalties={decisionResult.penalties} />

                        {/* Context/Summary Placeholder */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
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
                <AlternativeCards alternatives={decisionResult.alternatives || []} />

                {/* Bottom Spacer */}
                <div className="h-24" />
            </div>
        </main>
    );
}
