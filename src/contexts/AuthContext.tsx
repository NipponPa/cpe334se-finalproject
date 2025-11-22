'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { updateProfileWithGoogleAvatar } from '@/lib/profilePictureUtils'
import { handleAuthError, getCurrentSession, logAuthEvent } from '@/lib/auth-utils'

type AuthContextType = {
  user: User | null
  // Using any for Supabase auth responses as they are complex types
 signUp: (email: string, password: string) => Promise<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  signIn: (email: string, password: string) => Promise<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  signInWithOAuth: (provider: 'google' | 'github' | 'facebook') => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<any> // eslint-disable-line @typescript-eslint/no-explicit-any
 loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    logAuthEvent('INIT', 'Starting AuthContext initialization');
    
    // Get initial session
    const getUser = async () => {
      try {
        logAuthEvent('GET_SESSION', 'Attempting to get initial session');
        const { session, error: sessionError } = await getCurrentSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          logAuthEvent('GET_SESSION_ERROR', { error: sessionError.message || sessionError });
          setUser(null);
        } else {
          logAuthEvent('GET_SESSION_SUCCESS', { hasSession: !!session, userId: session?.user?.id });
          setUser(session?.user || null);
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        logAuthEvent('GET_SESSION_ERROR', { error: error instanceof Error ? error.message : String(error) });
        setUser(null);
      } finally {
        setLoading(false);
      }

      // Listen for auth changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (_event, session) => {
          logAuthEvent('AUTH_STATE_CHANGE', { event: _event, hasSession: !!session, userId: session?.user?.id });
          
          try {
            const currentUser = session?.user || null;
            setUser(currentUser);
            
            // If user signed in with Google and doesn't have an avatar yet,
            // try to set their Google profile picture as their avatar
            if (currentUser && currentUser.app_metadata?.provider === 'google') {
              const googleAvatar = currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture;
              if (googleAvatar) {
                // Update the user's profile with the Google avatar
                await updateProfileWithGoogleAvatar(currentUser.id, googleAvatar);
                logAuthEvent('AVATAR_UPDATE', { userId: currentUser.id, provider: 'google' });
              }
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
            logAuthEvent('AUTH_STATE_CHANGE_ERROR', { error: error instanceof Error ? error.message : String(error) });
            // If there's an error during auth state change, ensure user is set to null
            setUser(null);
          }
          
          setLoading(false);
        }
      );

      return () => {
        logAuthEvent('UNSUBSCRIBE', 'Unsubscribing from auth state changes');
        subscription.unsubscribe();
      };
    };

    getUser();
  }, [])

  const signUp = async (email: string, password: string) => {
    logAuthEvent('SIGN_UP_START', { email });
    try {
      const response = await supabase.auth.signUp({ email, password })
      logAuthEvent('SIGN_UP_SUCCESS', { hasSession: !!response.data?.session?.user?.id, userId: response.data?.user?.id });
      return response
    } catch (error) {
      console.error('Sign up error:', error)
      logAuthEvent('SIGN_UP_ERROR', { error: error instanceof Error ? error.message : String(error) });
      return { error: { message: 'Sign up failed', name: 'SignUpError' } }
    }
 }

 const signIn = async (email: string, password: string) => {
    logAuthEvent('SIGN_IN_START', { email });
    try {
      const response = await supabase.auth.signInWithPassword({ email, password })
      logAuthEvent('SIGN_IN_SUCCESS', { hasSession: !!response.data?.session?.user?.id, userId: response.data?.user?.id });
      return response
    } catch (error) {
      console.error('Sign in error:', error)
      logAuthEvent('SIGN_IN_ERROR', { error: error instanceof Error ? error.message : String(error) });
      return { error: { message: 'Sign in failed', name: 'SignInError' } }
    }
 }

  const signInWithOAuth = async (provider: 'google' | 'github' | 'facebook') => {
    logAuthEvent('OAUTH_START', { provider });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/`
        }
      })
      
      if (error) {
        console.error('OAuth error:', error)
        logAuthEvent('OAUTH_ERROR', { provider, error: error.message });
      } else {
        logAuthEvent('OAUTH_SUCCESS', { provider });
      }
    } catch (error) {
      console.error('OAuth sign in error:', error)
      logAuthEvent('OAUTH_ERROR', { provider, error: error instanceof Error ? error.message : String(error) });
    }
  }

  const signOut = async () => {
    logAuthEvent('SIGN_OUT_START', { userId: user?.id });
    try {
      await supabase.auth.signOut()
      logAuthEvent('SIGN_OUT_SUCCESS', 'User signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error)
      logAuthEvent('SIGN_OUT_ERROR', { error: error instanceof Error ? error.message : String(error) });
      // Even if sign out fails, clear the local user state
      // Also handle any auth errors that might occur during sign out
      await handleAuthError(error as Error);
    } finally {
      setUser(null)
    }
  }

  const resetPassword = async (email: string) => {
    logAuthEvent('RESET_PASSWORD_START', { email });
    try {
      const result = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/` // Adjust the redirect URL as needed
      });
      logAuthEvent('RESET_PASSWORD_SUCCESS', { email });
      return result;
    } catch (error) {
      console.error('Reset password error:', error)
      logAuthEvent('RESET_PASSWORD_ERROR', { error: error instanceof Error ? error.message : String(error) });
      return { error: { message: 'Password reset failed', name: 'ResetPasswordError' } }
    }
  }

  const value = {
    user,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}