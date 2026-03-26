import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Higher sampling rate on the server to catch all API errors
  tracesSampleRate: 0.5,

  // Only enable verbose mode in development
  debug: process.env.NODE_ENV === "development",
});
