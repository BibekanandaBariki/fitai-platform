# 🔐 FitAI Platform API Keys & Secrets Guide

To run the FitAI ecosystem locally or deploy it to a production server (like Vercel or Render), you need to acquire several API keys and environment variables. Below is a step-by-step guide on what credentials you need, how to generate them, and where to put them.

### Where to Update Secrets
1. **Local Development:** Create a file named `.env.local` inside the `fitai/` folder and paste your keys there.
2. **Production (Vercel):** Go to your Vercel Project Dashboard → **Settings** → **Environment Variables** and paste them.

---

## 1. Supabase (Database & Authentication)
Supabase provides the PostgreSQL database (via Drizzle ORM) and OAuth integration (Google Magic Links).

**How to generate:**
1. Go to [Supabase.com](https://supabase.com/) and create a new project.
2. Once the project is created, go to **Project Settings → API**.
3. Copy the **Project URL** and paste it as `NEXT_PUBLIC_SUPABASE_URL`.
4. Copy the **anon / public key** and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Go to **Project Settings → Database**. Ensure "Use connection pooling" is checked.
6. Copy the **Connection String (URI)** and replace `[YOUR-PASSWORD]` with your actual database password. Set this as `DATABASE_URL`.

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."
DATABASE_URL="postgres://postgres.your-project-id:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres"
```

---

## 2. Anthropic (AI Workout & Coaching Engine)
FitAI uses Claude 3.5 Sonnet via the Vercel AI SDK to stream real-time workout generation and chat coaching.

**How to generate:**
1. Go to the [Anthropic Console](https://console.anthropic.com/).
2. Create an account and add billing details (or use free credits if applicable).
3. Go to **Settings → API Keys**.
4. Click **Create Key** and name it "FitAI Web".
5. Set this key as `ANTHROPIC_API_KEY`.

```env
ANTHROPIC_API_KEY="sk-ant-api03-xxxxxxxxx"
```

---

## 3. Upstash (Redis for BullMQ Background Jobs)
Redis is used for queue management and background processing.

**How to generate:**
1. Go to [Upstash.com](https://upstash.com/) and create a free account.
2. Click **Create Database** (Select Redis, Region close to you, and TLS Enabled).
3. Once created, scroll down to the **Redis Connect** section.
4. Copy the **URL (rediss://...)** format string.
5. Set this string as `REDIS_URL`.

```env
REDIS_URL="rediss://default:xxxxxx@regular-region-1234.upstash.io:6379"
```

---

## 4. Sentry (Error Tracking & Performance Monitoring)
Sentry monitors Next.js frontend, backend API, and Python Microservice bugs.

**How to generate:**
1. Go to [Sentry.io](https://sentry.io/) and create an organization.
2. Create a new Next.js project.
3. On the initialization screen, copy the **DSN** link.
4. Set this string as `NEXT_PUBLIC_SENTRY_DSN`.

```env
NEXT_PUBLIC_SENTRY_DSN="https://xxxxxx@xxxxxx.ingest.sentry.io/xxxx"
```

---

## Final Checklist
Your final `.env.local` inside the `fitai/` folder should look like this:

```env
# Database (Supabase)
DATABASE_URL="postgres://..."
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."

# AI Engine (Anthropic)
ANTHROPIC_API_KEY="sk-ant-api03..."

# Background Jobs (Upstash Redis)
REDIS_URL="rediss://..."

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN="https://..."

# Base URL (for webhooks and callbacks)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
