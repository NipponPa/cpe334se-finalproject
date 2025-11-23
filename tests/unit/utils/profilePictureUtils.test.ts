// Mock environment variables before importing anything else
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the supabase module BEFORE importing the module that uses it
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        remove: vi.fn(),
        getPublicUrl: vi.fn(),
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn(),
      update: vi.fn(),
      insert: vi.fn(),
    })),
  },
}));

// Mock the imageOptimizer module
vi.mock('@/lib/imageOptimizer', () => ({
  optimizeImage: vi.fn((file) => Promise.resolve(file)),
}));

import {
  uploadProfilePicture,
  deleteProfilePicture,
  getUserProfilePicture,
  updateProfileWithGoogleAvatar
} from '@/lib/profilePictureUtils';
import { supabase } from '@/lib/supabase';
import { optimizeImage } from '@/lib/imageOptimizer';

describe('Profile Picture Utilities', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    
    // Mock console methods to avoid console output during tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

 describe('uploadProfilePicture', () => {
    it('should throw an error if user is not authenticated', async () => {
      (supabase.auth.getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { user: null },
      });

      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });

      await expect(uploadProfilePicture(file)).rejects.toThrow('User not authenticated');
    });

    it('should validate file type before upload', async () => {
      (supabase.auth.getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      });

      const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });

      await expect(uploadProfilePicture(invalidFile)).rejects.toThrow('Invalid file type');
    });

    it('should validate file size before upload', async () => {
      (supabase.auth.getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      });

      // Create a file with size > 5MB
      const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });

      await expect(uploadProfilePicture(largeFile)).rejects.toThrow('File size exceeds 5MB limit');
    });

    it('should optimize image before upload', async () => {
      (supabase.auth.getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      });

      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const mockOptimizedBlob = new Blob([''], { type: 'image/jpeg' });
      (optimizeImage as ReturnType<typeof vi.fn>).mockResolvedValue(mockOptimizedBlob);

      // Mock storage responses
      (supabase.storage.from as ReturnType<typeof vi.fn>).mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
        remove: vi.fn(),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/image.jpg' } }),
      });

      // Mock database update
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn(),
        update: vi.fn().mockResolvedValue({ error: null }),
        insert: vi.fn(),
      });

      await uploadProfilePicture(mockFile);

      expect(optimizeImage).toHaveBeenCalledWith(mockFile, 800, 800, 0.8);
    });

    it('should upload the profile picture and update user data', async () => {
      (supabase.auth.getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      });

      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const mockOptimizedBlob = new Blob([''], { type: 'image/jpeg' });
      (optimizeImage as ReturnType<typeof vi.fn>).mockResolvedValue(mockOptimizedBlob);

      // Mock storage responses
      (supabase.storage.from as ReturnType<typeof vi.fn>).mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
        remove: vi.fn(),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/image.jpg' } }),
      });

      // Mock database update
      const mockUpdateResult = { error: null };
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn(),
        update: vi.fn().mockResolvedValue(mockUpdateResult),
        insert: vi.fn(),
      });

      const result = await uploadProfilePicture(mockFile);

      expect(result).toEqual({
        success: true,
        url: 'https://example.com/image.jpg',
        fileName: expect.stringContaining('test-user-id/'),
        fileSize: mockOptimizedBlob.size,
        fileType: 'image/jpeg',
      });

      expect(supabase.storage.from).toHaveBeenCalledWith('profile-pictures');
      expect(supabase.from).toHaveBeenCalledWith('users');
    });

    it('should handle upload errors', async () => {
      (supabase.auth.getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      });

      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

      // Mock storage to return an error
      (supabase.storage.from as ReturnType<typeof vi.fn>).mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: null, error: { message: 'Upload failed' } }),
        remove: vi.fn(),
        getPublicUrl: vi.fn(),
      });

      await expect(uploadProfilePicture(mockFile)).rejects.toThrow('Upload failed: Upload failed');
    });

    it('should handle database update errors and clean up uploaded file', async () => {
      (supabase.auth.getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      });

      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const mockOptimizedBlob = new Blob([''], { type: 'image/jpeg' });
      (optimizeImage as ReturnType<typeof vi.fn>).mockResolvedValue(mockOptimizedBlob);

      // Mock storage responses
      const mockStorage = {
        upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
        remove: vi.fn(),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/image.jpg' } }),
      };
      (supabase.storage.from as ReturnType<typeof vi.fn>).mockReturnValue(mockStorage);

      // Mock database update to fail
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn(),
        update: vi.fn().mockResolvedValue({ error: { message: 'Database error' } }),
        insert: vi.fn(),
      });

      await expect(uploadProfilePicture(mockFile)).rejects.toThrow('Database update failed: Database error');
      expect(mockStorage.remove).toHaveBeenCalledWith([expect.stringContaining('test-user-id/')]);
    });
  });

  describe('deleteProfilePicture', () => {
    it('should throw an error if user is not authenticated', async () => {
      (supabase.auth.getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { user: null },
      });

      await expect(deleteProfilePicture()).rejects.toThrow('User not authenticated');
    });

    it('should throw an error if no profile picture exists', async () => {
      (supabase.auth.getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      });

      // Mock database to return no filename
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            single: vi.fn().mockResolvedValue({ 
              data: { profile_image_filename: null }, 
              error: null 
            }),
          }),
        }),
        update: vi.fn(),
        insert: vi.fn(),
      });

      await expect(deleteProfilePicture()).rejects.toThrow('No profile picture to delete');
    });

    it('should delete the profile picture and update user data', async () => {
      (supabase.auth.getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      });

      // Mock database to return filename
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            single: vi.fn().mockResolvedValue({ 
              data: { profile_image_filename: 'test-user-id/test.jpg' }, 
              error: null 
            }),
          }),
        }),
        update: vi.fn().mockResolvedValue({ error: null }),
        insert: vi.fn(),
      });

      // Mock storage to successfully remove file
      const mockStorage = {
        upload: vi.fn(),
        remove: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn(),
      };
      (supabase.storage.from as ReturnType<typeof vi.fn>).mockReturnValue(mockStorage);

      const result = await deleteProfilePicture();

      expect(result).toEqual({ success: true });
      expect(mockStorage.remove).toHaveBeenCalledWith(['test-user-id/test.jpg']);
      expect(supabase.from).toHaveBeenCalledWith('users');
    });

    it('should handle storage deletion errors', async () => {
      (supabase.auth.getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      });

      // Mock database to return filename
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            single: vi.fn().mockResolvedValue({ 
              data: { profile_image_filename: 'test-user-id/test.jpg' }, 
              error: null 
            }),
          }),
        }),
        update: vi.fn(),
        insert: vi.fn(),
      });

      // Mock storage to return an error
      const mockStorage = {
        upload: vi.fn(),
        remove: vi.fn().mockResolvedValue({ error: { message: 'Deletion failed' } }),
        getPublicUrl: vi.fn(),
      };
      (supabase.storage.from as ReturnType<typeof vi.fn>).mockReturnValue(mockStorage);

      await expect(deleteProfilePicture()).rejects.toThrow('Failed to delete profile picture: Deletion failed');
    });

    it('should handle database update errors', async () => {
      (supabase.auth.getUser as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      });

      // Mock database to return filename
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            single: vi.fn().mockResolvedValue({ 
              data: { profile_image_filename: 'test-user-id/test.jpg' }, 
              error: null 
            }),
          }),
        }),
        update: vi.fn().mockResolvedValue({ error: { message: 'Database error' } }),
        insert: vi.fn(),
      });

      // Mock storage to successfully remove file
      const mockStorage = {
        upload: vi.fn(),
        remove: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn(),
      };
      (supabase.storage.from as ReturnType<typeof vi.fn>).mockReturnValue(mockStorage);

      await expect(deleteProfilePicture()).rejects.toThrow('Database update failed: Database error');
    });
 });

  describe('getUserProfilePicture', () => {
    it('should return the profile picture URL for a user', async () => {
      const userId = 'test-user-id';
      const expectedUrl = 'https://example.com/avatar.jpg';
      
      // Mock database response
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            single: vi.fn().mockResolvedValue({ 
              data: { avatar_url: expectedUrl }, 
              error: null 
            }),
          }),
        }),
        update: vi.fn(),
        insert: vi.fn(),
      });

      const result = await getUserProfilePicture(userId);

      expect(result).toBe(expectedUrl);
      expect(supabase.from).toHaveBeenCalledWith('users');
    });

    it('should return null if user has no profile picture', async () => {
      const userId = 'test-user-id';
      
      // Mock database response with null avatar_url
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            single: vi.fn().mockResolvedValue({ 
              data: { avatar_url: null }, 
              error: null 
            }),
          }),
        }),
        update: vi.fn(),
        insert: vi.fn(),
      });

      const result = await getUserProfilePicture(userId);

      expect(result).toBeNull();
    });

    it('should return null if user does not exist', async () => {
      const userId = 'test-user-id';
      
      // Mock database error
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            single: vi.fn().mockResolvedValue({ 
              data: null, 
              error: { message: 'User not found' } 
            }),
          }),
        }),
        update: vi.fn(),
        insert: vi.fn(),
      });

      const result = await getUserProfilePicture(userId);

      expect(result).toBeNull();
    });
  });

 describe('updateProfileWithGoogleAvatar', () => {
    it('should return error if no Google avatar URL is provided', async () => {
      const result = await updateProfileWithGoogleAvatar('test-user-id', '');

      expect(result).toEqual({
        success: false,
        error: 'No Google avatar URL provided'
      });
    });

    it('should update user profile with Google avatar URL', async () => {
      const userId = 'test-user-id';
      const googleAvatarUrl = 'https://example.com/google-avatar.jpg';
      
      // Mock successful database update
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn(),
        update: vi.fn().mockResolvedValue({ error: null }),
        insert: vi.fn(),
      });

      const result = await updateProfileWithGoogleAvatar(userId, googleAvatarUrl);

      expect(result).toEqual({ success: true });
      expect(supabase.from).toHaveBeenCalledWith('users');
    });

    it('should handle database update errors', async () => {
      const userId = 'test-user-id';
      const googleAvatarUrl = 'https://example.com/google-avatar.jpg';
      
      // Mock database update error
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn(),
        update: vi.fn().mockResolvedValue({ error: { message: 'Database error' } }),
        insert: vi.fn(),
      });

      const result = await updateProfileWithGoogleAvatar(userId, googleAvatarUrl);

      expect(result).toEqual({
        success: false,
        error: 'Database error'
      });
    });
  });
});