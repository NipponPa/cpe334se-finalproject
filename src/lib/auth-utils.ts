import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

// Define a type for errors
interface AuthError {
  message?: string;
  name?: string;
  status?: number;
}

// Enhanced logging function for authentication events
export const logAuthEvent = (event: string, details?: Record<string, unknown> | string | number | boolean | null) => {
  const timestamp = new Date().toISOString();
  console.log(`[Auth-${event}] ${timestamp}`, details || '');
};

/**
 * Handles refresh token errors by attempting to recover the session
 * or clearing invalid session data
 */
export const handleAuthError = async (error: AuthError | Error) => {
  console.error('Authentication error occurred:', error);
  
  // Check if it's a refresh token error
  if (error?.message?.includes('Invalid Refresh Token') || error?.message?.includes('Refresh Token Not Found')) {
    console.warn('Refresh token error detected - clearing session storage');
    
    // Clear the problematic session from storage
    const storageKey = 'sb-sukoajgdqnozwxbsislg-auth-token'; // Using the project ref from .env
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(storageKey);
        window.localStorage.removeItem(`${storageKey}-user`);
      }
    } catch (storageError) {
      console.error('Error clearing storage:', storageError);
    }
    
    // Sign out the user to reset the session
    try {
      await supabase.auth.signOut();
    } catch (signOutError) {
      console.error('Error during sign out:', signOutError);
    }
    
    return true; // Indicates that the error was handled
  }
  
  return false; // Indicates that the error was not handled
};

/**
 * Safely gets the current session, with error handling for refresh token issues
 */
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      const handled = await handleAuthError(error);
      if (handled) {
        // Return null to indicate that the session is invalid
        return { session: null, error: new Error('Session was cleared due to refresh token error') };
      }
      return { session: null, error };
    }
    
    return { session, error: null };
  } catch (error: unknown) {
    console.error('Unexpected error getting session:', error);
    if (error instanceof Error || (typeof error === 'object' && error !== null && 'message' in error)) {
      const handled = await handleAuthError(error as AuthError | Error);
      if (handled) {
        return { session: null, error: new Error('Session was cleared due to refresh token error') };
      }
    } else {
      const genericError = new Error('Unknown error occurred');
      const handled = await handleAuthError(genericError);
      if (handled) {
        return { session: null, error: new Error('Session was cleared due to refresh token error') };
      }
      return { session: null, error: genericError };
    }
    return { session: null, error: error as AuthError | Error };
  }
};

/**
 * A wrapper for Supabase operations that handles refresh token errors
 */
export const withAuthErrorHandling = async <T>(operation: () => Promise<T>): Promise<{ data?: T; error?: AuthError | Error }> => {
  try {
    const result = await operation();
    return { data: result };
  } catch (error: unknown) {
    console.error('Operation failed with error:', error);
    
    // Type guard to ensure error is the right type
    if (error instanceof Error || (typeof error === 'object' && error !== null && 'message' in error)) {
      const handled = await handleAuthError(error as AuthError | Error);
      if (handled) {
        return { error: new Error('Session was cleared due to refresh token error') };
      }
    } else {
      // Handle case where error is not an Error object
      const genericError = new Error('Unknown error occurred');
      const handled = await handleAuthError(genericError);
      if (handled) {
        return { error: new Error('Session was cleared due to refresh token error') };
      }
      return { error: genericError };
    }
    
    return { error: error as AuthError | Error };
  }
};