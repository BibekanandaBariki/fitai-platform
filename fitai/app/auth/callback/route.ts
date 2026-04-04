import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // 1. OAuth provider error (e.g. user denied permissions)
  const oauthError = searchParams.get('error_description') || searchParams.get('error')
  if (oauthError) {
    console.error("OAuth Provider Error:", oauthError)
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(oauthError)}`)
  }

  // 2. PKCE Flow — server-side code exchange
  if (code) {
    const supabase = await createClient()
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("PKCE Code Exchange Error:", error.message)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }

    if (authData?.user) {
      const user = authData.user

      // 3. Sync user to local Drizzle DB — non-fatal if DATABASE_URL is broken
      try {
        const { db } = await import('@/db')
        const { users } = await import('@/db/schema')
        const { eq } = await import('drizzle-orm')

        const existing = await db.select().from(users).where(eq(users.id, user.id)).limit(1)

        if (existing.length === 0) {
          // Brand-new user — create record and send to onboarding
          await db.insert(users).values({
            id: user.id,
            email: user.email!,
            authProvider: 'google',
          })
          return NextResponse.redirect(`${origin}/step-1`)
        }

        if (!existing[0].isOnboarded) {
          return NextResponse.redirect(`${origin}/step-1`)
        }
      } catch (dbError: any) {
        // DB unavailable (bad DATABASE_URL, network issue, etc.)
        // PKCE cookies are already set — user is authenticated. Continue to dashboard.
        console.error("DB sync skipped (non-fatal):", dbError?.message ?? String(dbError))
      }

      // 4. Safe domain redirect after successful login
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

  // 5. No ?code param — fallback to client-side verify page
  return NextResponse.redirect(`${origin}/auth/verify`)
}
