import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  
  // 1. Check if Supabase passed an auth provider error (e.g. invalid Google keys)
  const oauthError = searchParams.get('error_description') || searchParams.get('error')
  if (oauthError) {
    console.error("OAuth Provider Error:", oauthError);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(oauthError)}`)
  }

  // 2. PKCE Flow (Secure Server-side code exchange)
  if (code) {
    const supabase = await createClient()
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("Supabase PKCE Code Exchange Error:", error.message);
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }

    if (!error && authData?.user) {
      const user = authData.user;
      
      // Determine if user exists in our local Drizzle DB
      const existingUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1)

      if (existingUser.length === 0) {
        // Create new user in PostgreSQL pointing to the Supabase ID
        await db.insert(users).values({
          id: user.id, // Supabase UUID
          email: user.email!,
          authProvider: 'google', // Defaulting based on oauth or get from identity
        })

        // Un-onboarded users go straight to step-1
        return NextResponse.redirect(`${origin}/step-1`)
      }

      // Check if partially onboarded
      if (!existingUser[0].isOnboarded) {
        return NextResponse.redirect(`${origin}/step-1`)
      }

      // Safe domain redirect
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // 3. Implicit Grant Flow Fallback (Hash fragment token)
  // If PKCE is disabled in Supabase, the URL contains `#access_token=...`
  // The server cannot read hash fragments, but the browser can!
  // By redirecting back to the app, the `@supabase/ssr` browser client will 
  // slurp the token and sign them in automatically on the client side.
  return NextResponse.redirect(`${origin}/step-1`)
}
