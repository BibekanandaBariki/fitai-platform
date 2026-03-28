"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export function URLSanitizer() {
  useEffect(() => {
    // Only run if there is a hash fragment and it looks like a Supabase Implicit Grant
    if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
      
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // The safest way to clean the URL is to wait for Supabase to officially process the token
      // into its secure HttpOnly cookies, and THEN wipe the URL so no session data is lost.
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_IN") {
          // Supabase successfully read the hash, clean the URL immediately!
          window.history.replaceState(null, "", window.location.pathname);
        }
      });

      // Fallback: If 1.5 seconds pass and the hash is still there (perhaps the session was 
      // already cached or the event fired before we mounted), forcefully wipe the URL anyway.
      const timeoutId = setTimeout(() => {
        if (window.location.hash.includes("access_token")) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }, 1500);

      return () => {
        subscription.unsubscribe();
        clearTimeout(timeoutId);
      };
    }
  }, []);

  return null; // This component is invisible
}
