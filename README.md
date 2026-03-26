<div align="center">

# 🏋️ FitAI Platform

### India's #1 AI-Powered Fitness Ecosystem

**Personalized AI Workout Plans · Real-Time Coaching · Progress Analytics · Multi-Language Support**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![Claude AI](https://img.shields.io/badge/Claude-3.5%20Sonnet-orange?style=for-the-badge)](https://anthropic.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-green?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 🌟 Overview

**FitAI** is a world-class AI-powered fitness platform built to out-compete MyFitnessPal, Healthify Me, and Fitbit. It leverages **Claude 3.5 Sonnet** for intelligent workout plan generation and real-time coaching, **Supabase** for secure authentication, **Drizzle ORM** for type-safe database access, and a **Python/FastAPI** microservice for advanced predictive analytics.

Built specifically for the Indian market with full support for **English, Hindi, Tamil, Telugu, and Bengali**.

---

## 🚀 Features

### 🤖 AI-Powered Fitness Engine
- **Intelligent Workout Plan Generation** — Claude 3.5 Sonnet generates structured, progressive-overload plans based on your goals, fitness level, and available equipment
- **Real-Time AI Coach Chat** — Streaming conversational coach using the Vercel AI SDK
- **Plateau Detection** — Automatically detects training plateaus via RPE + volume analysis
- **Injury Risk Scoring** — ACWR + HRV + sleep composite risk score
- **Goal Date Prediction** — Linear regression on weight trend + caloric deficit modelling

### 🔐 Authentication & Security
- Google OAuth via Supabase Auth
- Magic Link (passwordless email)
- Server-side OAuth callback that syncs Supabase users into local PostgreSQL
- Secure session management via SSR cookies

### 🧠 Smart 7-Step Onboarding
- Goals → Physical Metrics → Fitness Level → Health Conditions → Schedule → Nutrition → Wearables
- Zustand state persisted across steps with `localStorage`
- Confetti completion screen with AI plan generation triggered instantly

### 📊 Progress Tracking
- Body weight chart (Recharts) with 7 / 30 / 90 / All-time toggle
- Personal Records log
- Progress photo comparison gallery
- GitHub-style workout consistency heatmap

### 🌏 Multi-Language Support
- `next-intl` with cookie-based locale detection (no URL prefix change)
- Translations: **EN · HI · TA · TE · BN**

### ⚙️ DevOps & Infrastructure
- **BullMQ + Redis** — Background job queues for health sync, emails, plateau detection
- **Sentry** — Client + Server + Edge error monitoring with Session Replay
- **GitHub Actions CI/CD** — Lint → Build → Vercel Deploy → ML Syntax Check pipeline
- **Docker Compose** — One command to spin up PostgreSQL, Redis, and the ML service

---

## 🏗️ Architecture

```
fitai-platform/
├── fitai/                          # Next.js 16 Web App
│   ├── app/
│   │   ├── (auth)/login/           # Supabase OAuth login
│   │   ├── (onboarding)/step-[n]/ # 7-step wizard
│   │   ├── (app)/                  # Authenticated shell
│   │   │   ├── dashboard/          # Personalized home
│   │   │   ├── workout/            # Plan + Execution
│   │   │   ├── nutrition/          # Macro tracking
│   │   │   ├── progress/           # Charts + Photos
│   │   │   ├── coach/              # AI chat
│   │   │   └── community/          # Social feed
│   │   ├── api/
│   │   │   ├── chat/               # Claude 3.5 streaming endpoint
│   │   │   └── trpc/[trpc]/        # tRPC handler
│   │   └── auth/callback/          # Supabase ↔ Drizzle sync
│   ├── server/routers/             # tRPC API routers
│   ├── lib/
│   │   ├── ai/                     # Claude + Anthropic config
│   │   ├── trpc/                   # tRPC client + provider
│   │   ├── supabase/               # Client + server Supabase
│   │   └── queue/                  # BullMQ client + worker
│   ├── store/                      # Zustand state stores
│   ├── messages/                   # i18n JSON dictionaries
│   └── packages/db/schema.ts       # Drizzle ORM schema
│
├── services/
│   └── ml/                         # Python FastAPI ML service
│       ├── main.py                 # Predictive analytics endpoints
│       ├── requirements.txt
│       └── Dockerfile
│
├── .github/workflows/ci.yml        # GitHub Actions pipeline
├── docker-compose.yml              # Local dev orchestration
└── README.md
```

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| **Animations** | Framer Motion, Canvas Confetti |
| **State** | Zustand + TanStack Query |
| **Charts** | Recharts |
| **Backend API** | tRPC (type-safe, end-to-end) |
| **AI / ML** | Claude 3.5 Sonnet (Anthropic), Vercel AI SDK |
| **ML Service** | Python 3.11, FastAPI, scikit-learn, NumPy |
| **Database** | PostgreSQL 16 (Supabase) + Drizzle ORM |
| **Auth** | Supabase Auth (OAuth, Magic Link) |
| **Queue** | BullMQ + Redis (ioredis) |
| **i18n** | next-intl (EN, HI, TA, TE, BN) |
| **Monitoring** | Sentry (Client + Server + Edge + Session Replay) |
| **CI/CD** | GitHub Actions → Vercel |
| **Local Dev** | Docker Compose |

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://anthropic.com) API key
- A [Sentry](https://sentry.io) project (optional for local dev)

### 1. Clone the Repository
```bash
git clone https://github.com/bibekanandabariki/fitai-platform.git
cd fitai-platform
```

### 2. Configure Environment Variables
```bash
cp fitai/.env.example fitai/.env.local
```

Edit `fitai/.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Anthropic (Claude AI)
ANTHROPIC_API_KEY=sk-ant-...

# Database (PostgreSQL via Docker)
DATABASE_URL=postgresql://fitai_user:fitai_password@localhost:5432/fitai

# Redis (via Docker)
REDIS_URL=redis://localhost:6379

# Sentry (optional for local dev)
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

### 3. Start Backend Services (Docker)
```bash
# Starts PostgreSQL 16 + Redis 7 + FastAPI ML service
docker compose up -d
```

### 4. Install & Run the Web App
```bash
cd fitai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Run Background Workers (Optional)
```bash
# In a separate terminal
cd fitai
npm run worker
```

### 6. ML Service (Standalone, without Docker)
```bash
cd services/ml
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 🤖 ML Microservice Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Service health check |
| `/predict-plateau` | POST | Detects training plateau from workout history |
| `/predict-goal-date` | POST | Estimates goal achievement date via regression |
| `/injury-risk-score` | POST | Composite ACWR + HRV + sleep risk score |

---

## 🔄 CI/CD Pipeline

Every push to `main` triggers the full pipeline on GitHub Actions:

```
Push to main
    │
    ├── 🔍 Quality Check (TypeScript + ESLint)
    │
    ├── 🏗️ Next.js Production Build
    │
    ├── 🚀 Vercel Deploy (production)
    │
    └── 🤖 ML Service Syntax Validation (Python)
```

**Required GitHub Secrets:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`
- `DATABASE_URL`
- `ANTHROPIC_API_KEY`
- `VERCEL_TOKEN`

---

## 🗺️ Roadmap

- [ ] Razorpay + Stripe subscription payments
- [ ] React Native Expo mobile app
- [ ] Meal photo analysis (GPT-4o Vision)
- [ ] Apple HealthKit / Google Fit wearable sync
- [ ] Live leaderboards (Socket.io)
- [ ] Expert trainer marketplace + video consultations
- [ ] Biometric login (WebAuthn)
- [ ] Overtraining detection (HRV + sleep composite model)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ in India 🇮🇳 · Powered by Claude 3.5 Sonnet 🤖

</div>
