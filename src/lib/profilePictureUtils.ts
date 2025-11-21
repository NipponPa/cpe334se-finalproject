import { supabase } from './supabase';
import { optimizeImage } from './imageOptimizer';

/**
 * Validates a file before upload
 * @param file The file to validate
 * @param userId The ID of the current user
 * @returns Validation result
 */
const validateFileForUpload = (file: File, userId: string): { isValid: boolean; error?: string } => {
  // Validate file type
 const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only JPEG, PNG, GIF, and WEBP files are allowed.'
    };
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return {
      isValid: false,
      error: 'File size exceeds 5MB limit'
    };
  }

  // Validate filename doesn't contain dangerous characters
  const fileName = file.name;
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return {
      isValid: false,
      error: 'Invalid filename'
    };
 }

  return { isValid: true };
};

/**
 * Uploads a profile picture for the authenticated user
 * @param file The image file to upload
 * @returns Object containing success status and either the URL or an error message
 */
export const uploadProfilePicture = async (file: File) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Validate the file before proceeding
  const validation = validateFileForUpload(file, user.id);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid file');
  }

  // Optimize the image before upload
  const optimizedBlob = await optimizeImage(file, 800, 800, 0.8);
  const optimizedFile = new File([optimizedBlob], file.name, { type: file.type });

  // Validate the optimized file as well
  const optimizedValidation = validateFileForUpload(optimizedFile, user.id);
  if (!optimizedValidation.isValid) {
    throw new Error(optimizedValidation.error || 'Invalid optimized file');
  }

  // Create a unique filename using user ID and timestamp
  const fileExtension = file.type.split('/')[1];
  const fileName = `${user.id}/${Date.now()}_profile.${fileExtension}`;
  
  // Upload the file to the profile-pictures bucket
 const { data, error } = await supabase.storage
    .from('profile-pictures')
    .upload(fileName, optimizedFile, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get the public URL for the uploaded image
  const { data: publicUrlData } = supabase.storage
    .from('profile-pictures')
    .getPublicUrl(fileName);

  if (!publicUrlData?.publicUrl) {
    throw new Error('Could not generate public URL for the uploaded image');
  }

 // Update user profile with the new avatar URL and metadata
  const { error: updateUserError } = await supabase
    .from('users')
    .update({
      avatar_url: publicUrlData.publicUrl,
      profile_image_filename: fileName,
      profile_image_size: optimizedFile.size,
      profile_image_type: optimizedFile.type,
      profile_image_updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (updateUserError) {
    // If database update fails, try to delete the uploaded file to avoid orphaned files
    await supabase.storage.from('profile-pictures').remove([fileName]);
    throw new Error(`Database update failed: ${updateUserError.message}`);
  }

  return {
    success: true,
    url: publicUrlData.publicUrl,
    fileName,
    fileSize: optimizedFile.size,
    fileType: optimizedFile.type
  };
};

/**
 * Deletes the current user's profile picture
 * @returns Object containing success status and optional error message
 */
export const deleteProfilePicture = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get current profile picture filename
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('profile_image_filename')
    .eq('id', user.id)
    .single();

  if (userError) {
    throw new Error(`Could not fetch user data: ${userError.message}`);
  }

  if (!userData.profile_image_filename) {
    throw new Error('No profile picture to delete');
  }

  // Remove the file from storage
  const { error: deleteError } = await supabase.storage
    .from('profile-pictures')
    .remove([userData.profile_image_filename]);

  if (deleteError) {
    throw new Error(`Failed to delete profile picture: ${deleteError.message}`);
  }

  // Update user profile to remove avatar URL and metadata
  const { error: updateUserError } = await supabase
    .from('users')
    .update({
      avatar_url: null,
      profile_image_filename: null,
      profile_image_size: null,
      profile_image_type: null,
      profile_image_updated_at: null
    })
    .eq('id', user.id);

  if (updateUserError) {
    throw new Error(`Database update failed: ${updateUserError.message}`);
  }

  return {
    success: true
  };
};

/**
 * Gets the profile picture URL for a specific user
 * @param userId The ID of the user
 * @returns The profile picture URL or null if not set
 */
export const getUserProfilePicture = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('avatar_url')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile picture:', error);
    return null;
  }

  return data?.avatar_url || null;
};

/**
 * Updates user's profile picture with a Google profile image when signing in with Google
 * @param userId The ID of the user
 * @param googleAvatarUrl The Google profile image URL
 * @returns Object containing success status and optional error message
 */
export const updateProfileWithGoogleAvatar = async (userId: string, googleAvatarUrl: string) => {
  if (!googleAvatarUrl) {
    return { success: false, error: 'No Google avatar URL provided' };
  }

  try {
    // Update user profile with the Google avatar URL
    const { error } = await supabase
      .from('users')
      .update({
        avatar_url: googleAvatarUrl,
        profile_image_filename: null, // Google avatars are external URLs
        profile_image_size: null,
        profile_image_type: null,
        profile_image_updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      throw new Error(`Database update failed: ${error.message}`);
    }

    return {
      success: true
    };
   } catch (error) {
     const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
     return {
       success: false,
       error: errorMessage
     };
   }
 };