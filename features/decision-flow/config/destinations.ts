import { DestinationInfo } from '@/types/destination';

export const DESTINATION_DATA: Record<string, DestinationInfo> = {
    'KAPADOKYA': {
        ideal: [4, 5, 6],
        medium: [3, 10],
        poor: [1, 2, 7, 8, 9, 11, 12],
        priceLevel: 3,
        crowdLevel: 3,
        categories: { entertainment: 40, peace: 80, nature: 90, luxury: 60, culture: 100 },
        risks: { weather: 15, scam: 5, trap: 10, cancel: 5, safety: 2 }
    },
    'BODRUM': {
        ideal: [5, 6, 9],
        medium: [4, 10],
        poor: [1, 2, 3, 7, 8, 11, 12],
        priceLevel: 5,
        crowdLevel: 5,
        categories: { entertainment: 100, peace: 30, nature: 60, luxury: 90, culture: 40 },
        risks: { weather: 5, scam: 15, trap: 20, cancel: 2, safety: 5 }
    },
    'ESKİŞEHİR': {
        ideal: [4, 5, 9, 10],
        medium: [3, 11],
        poor: [1, 2, 6, 7, 8, 12],
        priceLevel: 2,
        crowdLevel: 3,
        categories: { entertainment: 70, peace: 60, nature: 40, luxury: 30, culture: 90 },
        risks: { weather: 10, scam: 2, trap: 5, cancel: 2, safety: 2 }
    },
    'BOZCAADA': {
        ideal: [5, 6, 9],
        medium: [4, 10],
        poor: [1, 2, 3, 7, 8, 11, 12],
        priceLevel: 4,
        crowdLevel: 2,
        categories: { entertainment: 50, peace: 90, nature: 80, luxury: 60, culture: 60 },
        risks: { weather: 5, scam: 2, trap: 8, cancel: 10, safety: 1 }
    },
    'RİZE': {
        ideal: [6, 7, 8],
        medium: [5, 9],
        poor: [1, 2, 3, 4, 10, 11, 12],
        priceLevel: 3,
        crowdLevel: 2,
        categories: { entertainment: 30, peace: 95, nature: 100, luxury: 20, culture: 50 },
        risks: { weather: 15, scam: 2, trap: 5, cancel: 5, safety: 2 }
    }
};

export const SIGNATURE_NO_GO: Record<number, { city: string; reason: string }[]> = {
    8: [{ city: 'Santorini', reason: 'Extreme Kalabalık' }, { city: 'Dubai', reason: 'Aşırı Sıcak' }, { city: 'Alaçatı', reason: 'Kritik Yoğunluk' }],
    7: [{ city: 'Dubai', reason: 'Aşırı Sıcak' }, { city: 'Kuveyt', reason: 'Aşırı Sıcak' }, { city: 'Antalya', reason: 'Nem & Kalabalık' }],
    12: [{ city: 'Helsinki', reason: 'Aşırı Karanlık' }, { city: 'Reykjavik', reason: 'Sınırlı Gün Işığı' }]
};
