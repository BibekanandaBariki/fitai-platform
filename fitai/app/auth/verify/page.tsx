"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyAuthPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Dynamically import Supabase to avoid SSR issues
    const run = async () => {
      // If there is no hash, check if we already have a session
      if (!window.location.hash.includes("access_token")) {
        // No hash — maybe PKCE flow already set cookies, go to dashboard
        const { createBrowserClient } = await import("@supabase/ssr");
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
        );
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          router.replace("/dashboard");
        } else {
          setStatus("error");
          setErrorMsg("No session found. Please try logging in again.");
        }
        return;
      }

      // Parse token from URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const access_token = hashParams.get("access_token");
      const refresh_token = hashParams.get("refresh_token");

      if (!access_token || !refresh_token) {
        setStatus("error");
        setErrorMsg("Missing tokens in URL. Please try logging in again.");
        return;
      }

      try {
        // Use @supabase/supabase-js directly (not SSR wrapper) for reliable setSession
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
        );

        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error || !data.session) {
          throw error ?? new Error("setSession returned no session");
        }

        // Now also sync cookies via the SSR client so server-side tRPC can see them
        const { createBrowserClient } = await import("@supabase/ssr");
        const ssrClient = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
        );
        // Force SSR client to read the newly set session (it syncs cookies in background)
        await ssrClient.auth.getSession();

        // Clean URL
        window.history.replaceState(null, "", window.location.pathname);
        setStatus("success");

        // Navigate after a tiny pulse so Next.js SSR flushes updated cookies
        setTimeout(() => router.replace("/dashboard"), 500);
      } catch (err: any) {
        console.error("Verify page error:", err);
        setStatus("error");
        setErrorMsg(err?.message ?? "Authentication failed. Please try again.");
      }
    };

    run();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      {status === "loading" && (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <Loader2 className="h-14 w-14 text-primary animate-spin mb-6 drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]" />
          <h1 className="text-2xl font-bold font-heading mb-2">Securing your session…</h1>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest animate-pulse">
            Authenticating
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="h-14 w-14 text-primary mb-6 drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]" />
          <h1 className="text-2xl font-bold font-heading mb-2">Login Successful!</h1>
          <p className="text-muted-foreground font-mono text-sm">Redirecting to your dashboard…</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300 max-w-sm text-center">
          <XCircle className="h-14 w-14 text-destructive mb-6" />
          <h1 className="text-2xl font-bold font-heading mb-2">Login Failed</h1>
          <p className="text-muted-foreground text-sm mb-6">{errorMsg}</p>
          <Button onClick={() => router.replace("/login")} className="w-full">
            Back to Login
          </Button>
        </div>
      )}
    </div>
  );
}
