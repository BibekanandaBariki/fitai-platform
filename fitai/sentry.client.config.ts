import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Replay config for session recording on errors
  integrations: [
    Sentry.replayIntegration(),
  ],

  // Performance tracing
  tracesSampleRate: 0.1, // 10% of transactions in production

  // Session replay: capture 10% of sessions, 100% of error sessions
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Only enable verbose mode in development
  debug: process.env.NODE_ENV === "development",
});
