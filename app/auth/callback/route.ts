import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, error_description)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Exchange code for session
  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      console.error('Session exchange error:', sessionError)
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check onboarding status from database
    if (sessionData?.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', sessionData.user.id)
        .single()

      // Redirect to onboarding if not completed
      if (!userError && !userData?.onboarding_completed) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    }
  }

  // Redirect to home page for existing users
  return NextResponse.redirect(new URL('/home', request.url))
}
