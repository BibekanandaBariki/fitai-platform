"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log uncaught errors to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
          </svg>
        </div>

        <h1 className="text-2xl font-heading font-bold mb-2 text-foreground">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mb-6 text-sm">
          Our team has been automatically notified and is working on a fix.
          {error.digest && (
            <span className="block mt-2 font-mono text-xs text-muted-foreground/60">
              Error ID: {error.digest}
            </span>
          )}
        </p>

        <div className="flex gap-3 justify-center">
          <Button onClick={reset} className="shadow-[0_4px_14px_0_rgba(34,197,94,0.3)]">
            Try Again
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
