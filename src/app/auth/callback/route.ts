import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error);
      // Redirect to login with error
      return Response.redirect(`${requestUrl.origin}/login?error=oauth_error`);
    }
  }

  // Redirect to the desired page (home page by default)
  return Response.redirect(`${requestUrl.origin}${next}`);
}