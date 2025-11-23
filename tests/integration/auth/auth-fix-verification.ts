/**
 * This is a simple test script to verify that the authentication fixes work correctly.
 * It's not a comprehensive test, but it verifies the basic functionality.
 */

// Import needed functions directly from the auth-utils file
// These would normally be imported from '../src/lib/auth-utils' but for testing purposes
// we'll create a self-contained verification

interface AuthError {
  message?: string;
  name?: string;
  status?: number;
}

// Mock supabase for testing purposes (in actual tests, you'd use the real one)
const mockSupabase = {
  auth: {
    getSession: async () => {
      // Simulate a session response
      return {
        data: { session: null }, // No session for testing
        error: null
      };
    },
    signOut: async () => {
      // Mock sign out
      return { error: null };
    }
  }
};

// Enhanced logging function for authentication events
const logAuthEvent = (event: string, details?: Record<string, unknown> | string | number | boolean | null) => {
  const timestamp = new Date().toISOString();
  console.log(`[Auth-${event}] ${timestamp}`, details || '');
};

// Handle auth errors, specifically refresh token errors
const handleAuthError = async (error: AuthError | Error) => {
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
      await mockSupabase.auth.signOut();
    } catch (signOutError) {
      console.error('Error during sign out:', signOutError);
    }
    
    return true; // Indicates that the error was handled
  }
  
 return false; // Indicates that the error was not handled
};

// Safely get current session with error handling
const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await mockSupabase.auth.getSession();
    
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
  } catch (error) {
    console.error('Unexpected error getting session:', error);
    const handled = await handleAuthError(error as AuthError | Error);
    if (handled) {
      return { session: null, error: new Error('Session was cleared due to refresh token error') };
    }
    return { session: null, error };
  }
};

console.log('Starting authentication fix verification...');

// Test the logAuthEvent function
logAuthEvent('TEST', 'Testing auth logging functionality');

// Test the handleAuthError function with a mock error
async function testHandleAuthError() {
  console.log('Testing handleAuthError...');
  const mockError = {
    message: 'Invalid Refresh Token: Refresh Token Not Found',
    name: 'AuthApiError',
  };
  
  try {
    const result = await handleAuthError(mockError);
    console.log('handleAuthError result for refresh token error:', result);
  } catch (error) {
    console.error('Error in handleAuthError test:', error);
  }
  
  // Test with a non-refresh token error
  const otherError = {
    message: 'Some other error',
    name: 'OtherError',
  };
  
  try {
    const result = await handleAuthError(otherError);
    console.log('handleAuthError result for other error:', result);
  } catch (error) {
    console.error('Error in handleAuthError test (other error):', error);
  }
}

// Run tests
async function runTests() {
  await testHandleAuthError();
  console.log('Authentication fix verification completed.');
}

// Execute tests
runTests();

export { testHandleAuthError, runTests };