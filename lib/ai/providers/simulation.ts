import { AIProvider, AIRequest, AIResponse } from '../types';

export class SimulationProvider implements AIProvider {
    async generate(request: AIRequest): Promise<AIResponse> {
        const { destination, decision } = request;
        const { matchScore, verdict } = decision;
        const city = destination.name;

        // Simulate network latency
        await new Promise(resolve => setTimeout(resolve, 800));

        if (verdict === 'git') {
            return {
                summary: `Harekete geçmek için harika bir an! %${matchScore} uyum skoru yakaladık. ${city} şu an tam kafa dinlemelik ve verdiğiniz paranın karşılığını sonuna kadar alacağınız bir modda.`,
                pros: ["Mevsimsel avantaj", "Yüksek bütçe verimliliği", "Stratejik hedef uyumu"],
                cons: [],
                tone: 'positive',
                provider: 'simulation'
            };
        } else if (verdict === 'sinirda') {
            return {
                summary: `Biraz riskli bir seçim. %${matchScore} uyum skoru, ${city} için bazı "evet" ama çokça "belki" olduğunu söylüyor. Gitmeden önce kalabalığa veya maliyetlere bir kez daha göz atın.`,
                pros: ["Keşif potansiyeli"],
                cons: ["Maliyet/Verim dengesi düşük", "Yoğunluk uyarısı"],
                tone: 'caution',
                provider: 'simulation'
            };
        } else {
            return {
                summary: `Dürüst olalım: Bu rotada işler ters gidebilir. %${matchScore} skor, ${city} planının hem cebinizi yakabileceğini hem de beklediğiniz huzuru vermeyeceğini gösteriyor. Başka bir rotaya ne dersiniz?`,
                pros: [],
                cons: ["Kritik mevsim uyumsuzluğu", "Bütçe aşımı riski", "Güvenlik/Konfor endişesi"],
                tone: 'negative',
                provider: 'simulation'
            };
        }
    }
}
