import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  /* config options here */
};

const intlConfig = withNextIntl(nextConfig);

export default withSentryConfig(intlConfig, {
  // Sentry organization and project (set via env or hardcode for now)
  org: process.env.SENTRY_ORG || "fitai-platform",
  project: process.env.SENTRY_PROJECT || "fitai-web",

  // Silent Sentry build output in CI
  silent: !process.env.CI,

  // Upload source maps for readable stack traces in production
  widenClientFileUpload: true,

  // Tree-shaking for smaller client bundles
  disableLogger: true,

  // Auto-instrument Vercel serverless functions
  automaticVercelMonitors: true,
});

