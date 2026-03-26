import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)

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
        return NextResponse.redirect(`${origin}/onboarding/step-1`)
      }

      // Check if partially onboarded
      if (!existingUser[0].isOnboarded) {
        return NextResponse.redirect(`${origin}/onboarding/step-1`)
      }

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

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}
