// Mock environment variables before importing anything else
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the supabase module BEFORE importing the module that uses it
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
      getSession: vi.fn(),
    },
 },
}));

import { logAuthEvent, handleAuthError, getCurrentSession, withAuthErrorHandling } from '@/lib/auth-utils';
import { supabase } from '@/lib/supabase';

describe('Auth Utilities', () => {
 beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    // Mock console methods to avoid console output during tests
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe('logAuthEvent', () => {
    it('should log authentication events with timestamp', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const event = 'LOGIN';
      const details = { userId: 'test-user-id' };

      logAuthEvent(event, details);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(`[Auth-${event}]`),
        details
      );
    });

    it('should handle undefined details', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      const event = 'LOGOUT';

      logAuthEvent(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(`[Auth-${event}]`),
        ''
      );
    });
  });

  describe('handleAuthError', () => {
    it('should handle refresh token errors and clear session storage', async () => {
      const error = new Error('Invalid Refresh Token');
      const mockRemoveItem = vi.fn();
      
      // Mock localStorage
      Object.defineProperty(window, 'localStorage', {
        value: {
          removeItem: mockRemoveItem,
        },
        writable: true,
      });

      const result = await handleAuthError(error);

      expect(result).toBe(true);
      expect(mockRemoveItem).toHaveBeenCalledWith('sb-sukoajgdqnozwxbsislg-auth-token');
      expect(mockRemoveItem).toHaveBeenCalledWith('sb-sukoajgdqnozwxbsislg-auth-token-user');
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should handle refresh token not found errors', async () => {
      const error = new Error('Refresh Token Not Found');
      const mockRemoveItem = vi.fn();
      
      // Mock localStorage
      Object.defineProperty(window, 'localStorage', {
        value: {
          removeItem: mockRemoveItem,
        },
        writable: true,
      });

      const result = await handleAuthError(error);

      expect(result).toBe(true);
      expect(mockRemoveItem).toHaveBeenCalledWith('sb-sukoajgdqnozwxbsislg-auth-token');
      expect(mockRemoveItem).toHaveBeenCalledWith('sb-sukoajgdqnozwxbsislg-auth-token-user');
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should return false for non-refresh token errors', async () => {
      const error = new Error('Some other error');

      const result = await handleAuthError(error);

      expect(result).toBe(false);
      expect(supabase.auth.signOut).not.toHaveBeenCalled();
    });

    it('should handle errors during storage clearing', async () => {
      const error = new Error('Invalid Refresh Token');
      const mockRemoveItem = vi.fn(() => {
        throw new Error('Storage error');
      });
      
      // Mock localStorage
      Object.defineProperty(window, 'localStorage', {
        value: {
          removeItem: mockRemoveItem,
        },
        writable: true,
      });

      const result = await handleAuthError(error);

      expect(result).toBe(true);
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

 describe('getCurrentSession', () => {
    it('should return session when no error occurs', async () => {
      const mockSession = { user: { id: 'test-user' } };
      (supabase.auth.getSession as any).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const result = await getCurrentSession();

      expect(result).toEqual({ session: mockSession, error: null });
      expect(supabase.auth.getSession).toHaveBeenCalled();
    });

    it('should handle refresh token errors', async () => {
      const refreshTokenError = { message: 'Invalid Refresh Token' };
      (supabase.auth.getSession as any).mockResolvedValue({
        data: { session: null },
        error: refreshTokenError,
      });

      const result = await getCurrentSession();

      expect(result).toEqual({ session: null, error: null });
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should return error when other errors occur', async () => {
      const otherError = { message: 'Some other error' };
      (supabase.auth.getSession as any).mockResolvedValue({
        data: { session: null },
        error: otherError,
      });

      const result = await getCurrentSession();

      expect(result).toEqual({ session: null, error: otherError });
    });

    it('should handle unexpected errors', async () => {
      (supabase.auth.getSession as any).mockRejectedValue(new Error('Unexpected error'));

      const result = await getCurrentSession();

      expect(result).toEqual({ session: null, error: null });
    });
  });

  describe('withAuthErrorHandling', () => {
    it('should return data when operation succeeds', async () => {
      const mockOperation = vi.fn().mockResolvedValue('success data');

      const result = await withAuthErrorHandling(mockOperation);

      expect(result).toEqual({ data: 'success data' });
      expect(mockOperation).toHaveBeenCalled();
    });

    it('should handle refresh token errors', async () => {
      const refreshTokenError = new Error('Invalid Refresh Token');
      const mockOperation = vi.fn().mockRejectedValue(refreshTokenError);

      const result = await withAuthErrorHandling(mockOperation);

      expect(result).toEqual({ error: new Error('Session was cleared due to refresh token error') });
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should return error for other operation errors', async () => {
      const otherError = new Error('Some other error');
      const mockOperation = vi.fn().mockRejectedValue(otherError);

      const result = await withAuthErrorHandling(mockOperation);

      expect(result).toEqual({ error: otherError });
    });

    it('should handle non-Error objects', async () => {
      const mockOperation = vi.fn().mockRejectedValue('string error');

      const result = await withAuthErrorHandling(mockOperation);

      expect(result).toEqual({ error: new Error('Unknown error occurred') });
    });
  });
});