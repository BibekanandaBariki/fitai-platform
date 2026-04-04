"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2 } from "lucide-react";

export default function VerifyAuthPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Securing credentials...");

  useEffect(() => {
    // 1. Initialize Supabase client. 
    // If there is a hash fragment (#access_token=...), @supabase/ssr automatically 
    // extracts it and sets the secure HTTP cookies.
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    );

    // The Supabase Hash parser runs asynchronously on client creation
    // We MUST listen to the event rather than checking getSession synchronously
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setStatus("Success! Redirecting...");
        
        // Clean up hash from browser URL
        if (window.location.hash.includes("access_token")) {
           window.history.replaceState(null, "", window.location.pathname);
        }

        // Give the middleware/cookies a tiny fraction to sync with Next.js 
        // before we navigate
        setTimeout(() => {
            router.push("/dashboard");
        }, 300);
      }
    });

    // Fallback: If 3 seconds pass and no login event fired
    const timeoutId = setTimeout(async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
            router.push("/dashboard");
        } else {
            console.error("Auth Verification Timeout: No session found");
            router.push("/login?error=VerificationTimeout");
        }
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
        <h1 className="text-2xl font-bold font-heading mb-2">Login Verification</h1>
        <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">{status}</p>
      </div>
    </div>
  );
}
