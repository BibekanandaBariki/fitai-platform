import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Ensure these are defined so we don't throw mysterious errors during build
export const supabase = createClient(
    supabaseUrl || "https://placeholder-url.supabase.co",
    supabaseKey || "placeholder-key"
);
