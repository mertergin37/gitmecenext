# Gitmece | Algorithm-First Decision Authority 🌍🧠📊
**Next.js Migration V1.0.0**

> *"Duygusal kararlar yerine matematiksel gerçekler."*

Gitmece, seyahat planlarınızı 50+ parametre ile analiz eden, potansiyel riskleri hesaplayan ve size sadece dürüst gerçeği söyleyen bir algoritma otoritesidir.

---

## 🏗️ Teknoloji Stack (V1.0.0)

| Katman | Teknoloji | Not |
|--------|-----------|-----|
| **Core** | Next.js 14+ (App Router) | React Server Components |
| **Language** | TypeScript | Strict Mode |
| **Styling** | Tailwind CSS | Utility-first Design |
| **State** | Zustand | Persist Middleware |
| **Engine** | Pure Math Logic | Isolated Scoring Engine |
| **AI Layer** | Adapter Pattern | Simulation / Groq / Together |
| **Icons** | Lucide React | Modern & Clean |

---

## 📁 Mimari (Feature Slicing)

```bash
/gitmece-next
├── /app                  # App Router (Pages & Layout only)
│   ├── /decision         # Decision Flow Page
│   └── /result/[id]      # Verdict Screen
├── /features             # Business Logic & Workflows
│   └── /decision-flow    # Questionnaire Logic
├── /entities             # Domain Models
│   ├── /decision         # Verdict Types
│   └── /destination      # Destination Data
├── /lib                  # Core Algorithms (Pure Logic)
│   ├── /decision-engine  # Scoring System
│   └── /ai               # AI Adapter Core
├── /design-system        # UI Component Library
│   ├── /primitives       # Buttons, Cards
│   └── /decision-components # VerdictHero, RiskPanel
└── /store                # Global State (Zustand)
```

---

## 🚀 Kurulum & Çalıştırma

1.  **Bağımlılıkları Yükle:**
    ```bash
    npm install
    ```

2.  **Geliştirme Sunucusunu Başlat:**
    ```bash
    npm run dev
    ```

3.  **Tarayıcıda Aç:**
    `http://localhost:3000`

---

## 🤖 AI Adapter & Simulation Mode

Bu sürümde **AI Adapter V1** entegre edilmiştir.
-   Varsayılan olarak `SimulationProvider` çalışır.
-   İnternet bağlantısı veya API Key gerektirmez.
-   Karar sonuçlarına göre (Git/Gitme/Sınırda) dinamik metinler üretir.
-   Gelecekte `GroqProvider` veya `TogetherProvider` eklenerek gerçek AI bağlanabilir.

---

## 🛡️ Trust Engine UI

Sonuç ekranı (`/result/[id]`) şeffaflık üzerine kuruludur:
-   **VerdictHero:** Kararı (GİT / GİTME) dev puntolarla gösterir.
-   **ScoreBreakdown:** Mevsim, Fiyat, Kalabalık, Beklenti ve Risk analizini grafikleştirir.
-   **RiskPanel:** Kırmızı bayrakları (Güvenlik Uyarısı, Bütçe Aşımı) vurgular.

---

## 📅 Roadmap (Next Steps)

-   [x] **Phase 1: Next.js Migration (Tamamlandı)**
-   [ ] **Phase 2:** Supabase Database Connection
-   [ ] **Phase 3:** Real AI API Integration (Groq)
-   [ ] **Phase 4:** User Auth & Profile Sync

---

*Gitmece Team - 2026*
