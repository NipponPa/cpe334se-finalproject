import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/src/lib/supabase';

// Mock the supabase client
jest.mock('@/src/lib/supabase', () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: {
            unsubscribe: jest.fn()
          }
        }
      })),
      getSession: jest.fn()
    }
  }
}));

// Mock the auth-utils functions
jest.mock('@/src/lib/auth-utils', () => ({
  getCurrentSession: jest.fn(),
  handleAuthError: jest.fn(),
  logAuthEvent: jest.fn()
}));

// Mock the profile picture utils
jest.mock('@/src/lib/profilePictureUtils', () => ({
  updateProfileWithGoogleAvatar: jest.fn()
}));

const MockComponent = () => {
  const { user, loading } = useAuth();
  return (
    <div>
      <div data-testid="user">{user?.email || 'null'}</div>
      <div data-testid="loading">{loading.toString()}</div>
    </div>
  );
};

const renderWithAuthProvider = () => {
  return render(
    <AuthProvider>
      <MockComponent />
    </AuthProvider>
  );
};

describe('AuthContext Fix', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should not update state on TOKEN_REFRESHED event with same user', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    
    // Mock getSession to return a user session
    (require('@/src/lib/auth-utils').getCurrentSession as jest.Mock).mockResolvedValue({
      session: { user: mockUser },
      error: null
    });

    const { getByTestId } = renderWithAuthProvider();

    // Wait for initial render
    await waitFor(() => {
      expect(getByTestId('user').textContent).toBe('test@example.com');
    });

    // Simulate a TOKEN_REFRESHED event with the same user
    const authStateChangeCallback = (supabase.auth.onAuthStateChange as jest.Mock).mock.calls[0][0];
    await authStateChangeCallback('TOKEN_REFRESHED', { user: mockUser });

    // The user should remain the same
    expect(getByTestId('user').textContent).toBe('test@example.com');
  });

  test('should update state when user changes', async () => {
    const mockUser1 = { id: '123', email: 'test1@example.com' };
    const mockUser2 = { id: '456', email: 'test2@example.com' };
    
    // Mock getSession to return a user session
    (require('@/src/lib/auth-utils').getCurrentSession as jest.Mock).mockResolvedValue({
      session: { user: mockUser1 },
      error: null
    });

    const { getByTestId } = renderWithAuthProvider();

    // Wait for initial render
    await waitFor(() => {
      expect(getByTestId('user').textContent).toBe('test1@example.com');
    });

    // Simulate an event with a different user
    const authStateChangeCallback = (supabase.auth.onAuthStateChange as jest.Mock).mock.calls[0][0];
    await authStateChangeCallback('SIGNED_IN', { user: mockUser2 });

    // The user should update to the new user
    expect(getByTestId('user').textContent).toBe('test2@example.com');
  });
});