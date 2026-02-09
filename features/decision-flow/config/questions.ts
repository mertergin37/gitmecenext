import { Question } from '@/types/decision';

export const QUESTIONS: Question[] = [
    {
        id: 'budget',
        text: 'Konaklama ve ulaşım bütçeniz hangi segmentte?',
        weight: 2,
        options: [
            { text: 'Ekonomik / Kısıtlı', value: 1 },
            { text: 'Orta / Standart', value: 3 },
            { text: 'Üst / Premium', value: 5 }
        ]
    },
    {
        id: 'crowd',
        text: 'Destinasyondaki insan yoğunluğu toleransınız nedir?',
        weight: 1.5,
        options: [
            { text: 'İzole alanlar tercih ederim', value: 1 },
            { text: 'Kontrollü kalabalık uygundur', value: 3 },
            { text: 'Yoğunluk beni etkilemez', value: 5 }
        ]
    },
    {
        id: 'purpose',
        text: 'Seyahatinizin temel stratejik hedefi nedir?',
        weight: 1,
        options: [
            { text: 'Mental Dinlenme', value: 1 },
            { text: 'Kültürel Keşif', value: 3 },
            { text: 'Sosyal Aktivite', value: 5 }
        ]
    },
    {
        id: 'weather',
        text: 'İklim koşulları planınızı ne derecede etkiler?',
        weight: 1.2,
        options: [
            { text: 'Çok hassasım, ideal olmalı', value: 1 },
            { text: 'Küçük sapmalar kabul edilebilir', value: 3 },
            { text: 'Koşullar önemsizdir', value: 5 }
        ]
    },
    {
        id: 'experience',
        text: 'Aradığın konfor ve hizmet düzeyi nedir?',
        weight: 1.3,
        options: [
            { text: 'Minimalist / Macera', value: 1 },
            { text: 'Dengeli / Standart', value: 3 },
            { text: 'Lüks / Full-Service', value: 5 }
        ]
    }
];
