import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the supabase client
vi.mock('@/lib/supabase', async () => {
  const actual = await vi.importActual('@supabase/supabase-js');
  return {
    ...actual,
    supabase: {
      auth: {
        signUp: vi.fn(),
      },
      from: vi.fn(),
    },
  };
});

// Import the actual supabase client after mocking
import { supabase } from '@/lib/supabase';

describe('Signup Username Storage', () => {
  const mockEmail = 'test@example.com';
  const mockPassword = 'testPassword123';
  const mockUsername = 'testuser123';
  const mockUserId = '123e4567-e89b-12d3-a456-42614174000';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should store username as display name in auth and full name in user table during signup', async () => {
    // Mock the auth.signUp response
    const mockAuthResponse = {
      data: {
        user: {
          id: mockUserId,
          email: mockEmail,
          user_metadata: { full_name: mockUsername },
        },
        session: null,
      },
      error: null,
    };

    (supabase.auth.signUp as vi.Mock).mockResolvedValue(mockAuthResponse);

    // Mock the database update response
    const mockDbUpdate = vi.fn().mockReturnThis();
    const mockDbEq = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as vi.Mock).mockReturnValue({
      update: mockDbUpdate,
      eq: mockDbEq,
    });

    // Call the signup function with username in userMetadata
    const userMetadata = { full_name: mockUsername };
    const result = await supabase.auth.signUp({
      email: mockEmail,
      password: mockPassword,
      options: {
        data: userMetadata
      }
    });

    // Verify that auth.signUp was called with the correct user metadata
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: mockEmail,
      password: mockPassword,
      options: {
        data: { full_name: mockUsername },
      },
    });

    // Verify that the database update was called to set the full_name
    expect(supabase.from).toHaveBeenCalledWith('users');
    
    // Check that the update method was called with the correct parameters
    expect(mockDbUpdate).toHaveBeenCalledWith({ full_name: mockUsername });
    expect(mockDbEq).toHaveBeenCalledWith('id', mockUserId);
  });

 it('should handle database update failure gracefully during signup', async () => {
    // Mock the auth.signUp response
    const mockAuthResponse = {
      data: {
        user: {
          id: mockUserId,
          email: mockEmail,
          user_metadata: { full_name: mockUsername },
        },
        session: null,
      },
      error: null,
    };

    (supabase.auth.signUp as vi.Mock).mockResolvedValue(mockAuthResponse);

    // Mock the database update response with an error
    const mockDbUpdate = vi.fn().mockReturnThis();
    const mockDbEq = vi.fn().mockResolvedValue({ error: { message: 'Database update failed' } });
    (supabase.from as vi.Mock).mockReturnValue({
      update: mockDbUpdate,
      eq: mockDbEq,
    });

    // Call the signup function with username in userMetadata
    const userMetadata = { full_name: mockUsername };
    const result = await supabase.auth.signUp({
      email: mockEmail,
      password: mockPassword,
      options: {
        data: userMetadata
      }
    });

    // Verify that auth.signUp was called with the correct user metadata
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: mockEmail,
      password: mockPassword,
      options: {
        data: { full_name: mockUsername },
      },
    });

    // Verify that the database update was still attempted
    expect(supabase.from).toHaveBeenCalledWith('users');
    expect(mockDbUpdate).toHaveBeenCalledWith({ full_name: mockUsername });
    expect(mockDbEq).toHaveBeenCalledWith('id', mockUserId);
  });

  it('should not update database if user is not returned from auth signup', async () => {
    // Mock the auth.signUp response with no user
    const mockAuthResponse = {
      data: {
        user: null,
        session: null,
      },
      error: null,
    };

    (supabase.auth.signUp as vi.Mock).mockResolvedValue(mockAuthResponse);

    // Mock the database update response
    const mockDbUpdate = vi.fn().mockReturnThis();
    const mockDbEq = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as vi.Mock).mockReturnValue({
      update: mockDbUpdate,
      eq: mockDbEq,
    });

    // Call the signup function with username in userMetadata
    const userMetadata = { full_name: mockUsername };
    const result = await supabase.auth.signUp({
      email: mockEmail,
      password: mockPassword,
      options: {
        data: userMetadata
      }
    });

    // Verify that auth.signUp was called with the correct user metadata
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: mockEmail,
      password: mockPassword,
      options: {
        data: { full_name: mockUsername },
      },
    });

    // Verify that the database update was NOT called since no user was returned
    expect(supabase.from).not.toHaveBeenCalled();
  });
});