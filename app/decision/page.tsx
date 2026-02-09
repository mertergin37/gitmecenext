import { DecisionStepper } from '@/features/decision-flow/DecisionStepper';
import { Header } from '@/components/layout/Header';

export default function DecisionPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 relative">
            {/* Background Ambience */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[128px] pointer-events-none" />

            {/* Header */}
            <Header />

            {/* Content */}
            <div className="relative z-10 w-full">
                <DecisionStepper />
            </div>

            {/* Footer Info */}
            <div className="absolute bottom-6 left-0 w-full text-center">
                <p className="text-white/20 text-xs uppercase tracking-widest">
                    Algorithm-First Decision Engine
                </p>
            </div>
        </main>
    );
}
