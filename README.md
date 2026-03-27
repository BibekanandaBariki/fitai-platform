# FitAI Platform — World's #1 AI Fitness Ecosystem 🏋️‍♂️🤖

![FitAI CI/CD](https://github.com/BibekanandaBariki/fitai-platform/actions/workflows/ci.yml/badge.svg)

FitAI is a state-of-the-art, AI-powered gamified fitness ecosystem built with Next.js 14, Drizzle ORM, Supabase, and Claude 3.5 Sonnet. It dynamically tracks progress, generates hyper-personalized workout plans, and predicts health outcomes using advanced Machine Learning microservices.

## 🌟 Core Features

- **Smart Onboarding:** 7-step wizard capturing biometrics, equipment constraints, and goals.
- **Intelligent AI Coaching:** Dynamic workout generation powered by Claude 3.5 Sonnet.
- **Gamification & Social:** Global Leaderboards with an animated 3D podium and XP level system.
- **Nutrition Engine:** Built-in Indian Food Database (50k+ architecture) for hyper-local macro tracking.
- **Biometric Security:** WebAuthn Passkey and Face ID integration stubs.
- **Automated Reporting:** Generate and export detailed progress tracking charts directly to PDF.
- **ML Microservices:** Python FastAPI endpoint for Goal Prediction, Plateau Detection, and Injury Risk Assessment.

---

## 🏗️ Technology Stack

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** tRPC, Next.js Edge API Routes, Python FastAPI
- **Database:** PostgreSQL (via Supabase), Drizzle ORM
- **Asynchronous Queue:** BullMQ + Redis
- **AI/ML:** Anthropic (Claude 3.5 Sonnet), Vercel AI SDK
- **DevOps:** GitHub Actions, Docker, Sentry, Vercel

---

## 🚀 Quick Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/BibekanandaBariki/fitai-platform.git
cd "fitai-platform/fitai"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
You will need to create a `.env.local` file in the `fitai/` directory. See the **Secrets Guide** below for where to obtain these keys.

```env
# Database (Supabase)
DATABASE_URL="postgres://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."

# AI Engine (Anthropic)
ANTHROPIC_API_KEY="sk-ant-api03-xxx"

# Background Jobs (Upstash Redis)
REDIS_URL="rediss://default:xxx@region-xxx.upstash.io:6379"

# Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup (Drizzle)
```bash
npm run db:push
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
# App will run at http://localhost:3000
```

*Note: The Python FastAPI Microservice for ML features can be spun up using Docker Compose:*
```bash
docker-compose up -d
```

---

## 📄 License
MIT License. Created by Bibekananda Bariki.
