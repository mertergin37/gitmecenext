import Link from 'next/link';
import { ArrowRight, ShieldCheck, BarChart3, BrainCircuit } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white relative selection:bg-purple-500/30">

      {/* Premium Background */}
      <div className="mesh-bg opacity-40" />

      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 text-center max-w-5xl mx-auto">


        {/* Headline */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.95] animate-fade-in-up delay-100">
          Duygusal Kararlar <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/20">
            Yerine Yapay Zeka.
          </span>
        </h1>

        {/* Subline */}
        <p className="text-lg md:text-xl text-white/40 mb-12 max-w-2xl leading-relaxed animate-fade-in-up delay-200 font-medium">
          Gitmece, seyahat planlarınızı 50+ parametre ile analiz eder, riskleri hesaplar ve size sadece dürüst gerçeği söyler. <span className="text-white/80">Pazarlama yok, saf veri var.</span>
        </p>

        {/* CTA Button */}
        <Link
          href="/decision"
          className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-95 animate-fade-in-up delay-300 shadow-2xl shadow-white/10"
        >
          <span>Analizi Başlat</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />

          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        </Link>

        {/* Trust Stats */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl animate-fade-in-up delay-300">
          <div className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.05] transition-all overflow-hidden relative">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all" />
            <BarChart3 className="w-8 h-8 text-purple-400 mb-4 animate-float" />
            <div className="text-3xl font-black text-white mb-1">50+</div>
            <div className="text-[10px] text-white/40 font-black uppercase tracking-widest">Stratejik Parametre</div>
          </div>

          <div className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.05] transition-all overflow-hidden relative">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
            <BrainCircuit className="w-8 h-8 text-blue-400 mb-4 animate-float delay-100" />
            <div className="text-3xl font-black text-white mb-1">Gemini Pro</div>
            <div className="text-[10px] text-white/40 font-black uppercase tracking-widest">Live AI Analysis</div>
          </div>

          <div className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.05] transition-all overflow-hidden relative">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
            <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4 animate-float delay-200" />
            <div className="text-3xl font-black text-white mb-1">Objektif</div>
            <div className="text-[10px] text-white/40 font-black uppercase tracking-widest">Sıfır Manipülasyon</div>
          </div>
        </div>

      </div>
    </main>
  );
}
