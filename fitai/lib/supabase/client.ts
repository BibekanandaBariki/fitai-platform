import { createBrowserClient } from "@supabase/ssr";

// This MUST use createBrowserClient (SSR-aware), NOT createClient from @supabase/supabase-js.
// The SSR client:
//   1. Uses PKCE flow → server exchanges code for session in /auth/callback
//   2. Stores session in HttpOnly cookies (readable by server-side tRPC middleware)
//   3. Eliminates the #access_token hash fragment entirely
// The standard supabase-js client uses Implicit flow → localStorage only → server always gets 401
export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "placeholder-key"
);
