import React from 'react';
import { Header } from '@/components/layout/Header';
import { ShieldCheck, Target, Eye, Scale, Ban } from 'lucide-react';

export default function ManifestoPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white relative">
            <div className="mesh-bg opacity-20 fixed inset-0 pointer-events-none" />
            <Header />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 pb-40">
                {/* Header Section */}
                <div className="mb-24 text-center">
                    <span className="text-purple-500 font-black tracking-[0.4em] uppercase text-xs mb-4 block animate-fade-in-up">Marka Anayasası v1.0</span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-8 animate-fade-in-up delay-100">
                        Dürüstlük <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white/80 to-white/20">
                            Pazarlamadan Güçlüdür.
                        </span>
                    </h1>
                    <p className="text-xl text-white/40 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                        Gitmece bir seyahat sitesi değil, bir karar otoritesidir. Size nereye gitmeniz gerektiğini değil, gerçekten gitmeli misiniz onu söyleriz.
                    </p>
                </div>

                {/* Principles Grid */}
                <div className="grid gap-8">
                    <PrincipleCard
                        icon={<Scale className="w-6 h-6" />}
                        title="Matematik > Yorum"
                        description="Karar; veri, algoritma ve profil uyumu ile verilir. Influencer övgüleri veya süslü yorumlar Gitmece'nin kararını değiştiremez."
                    />
                    <PrincipleCard
                        icon={<Ban className="w-6 h-6" />}
                        title="Dürüstlük > Satış"
                        description="Eğer bir plan sizin profilinize uygun değilse, binlerce kişi gitse bile Gitmece size 'Gitme' der. Biz rezervasyon değil, doğru karar satıyoruz."
                    />
                    <PrincipleCard
                        icon={<Eye className="w-6 h-6" />}
                        title="Sıfır Manipülasyon"
                        description="Sponsorlu içerik, affiliate gizleme veya popülerlik uğruna skor yükseltme Gitmece'nin doğasında yoktur. Riskler asla saklanmaz."
                    />
                    <PrincipleCard
                        icon={<ShieldCheck className="w-6 h-6" />}
                        title="Risk Odaklı Analiz"
                        description="Hava durumu, bütçe uyumsuzluğu, güvenlik riskleri ve kalabalık oranları her analizin merkezindedir. Gerçekler can yaksa da söylenir."
                    />
                    <PrincipleCard
                        icon={<Target className="w-6 h-6" />}
                        title="Kişisel Uyum Otoritesi"
                        description="Popüler olan doğru değildir. Doğru olan kullanıcıya uygun olandır. Dünyanın en iyi şehri, sizin bütçenize veya huzur beklentinize uymuyorsa bizim için 0'dır."
                    />
                </div>

                {/* Final Cta */}
                <div className="mt-32 p-12 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-3xl text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <h2 className="text-3xl font-black mb-6 relative z-10">Bizimle Karar Verin.</h2>
                    <p className="text-white/40 mb-10 max-w-lg mx-auto relative z-10">
                        Gitmece, seyahat planlarını matematiksel dürüstlükle analiz eden kişisel karar motorudur.
                    </p>
                    <a
                        href="/decision"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all relative z-10"
                    >
                        Analizi Başlat
                    </a>
                </div>
            </div>
        </main>
    );
}

function PrincipleCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.05] transition-all group">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 group-hover:text-white group-hover:bg-purple-500 transition-all shrink-0">
                    {icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-3">{title}</h3>
                    <p className="text-white/50 leading-relaxed italic pr-4">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}
