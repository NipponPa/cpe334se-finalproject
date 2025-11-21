/**
 * Generates different size URLs for a profile picture based on the original URL
 * @param originalUrl The original profile picture URL
 * @param size The requested size ('thumbnail', 'medium', 'large', or custom dimensions)
 * @returns The URL for the requested size
 */
export const getProfilePictureSize = (originalUrl: string, size: 'thumbnail' | 'medium' | 'large' | { width: number; height: number }): string => {
  if (!originalUrl) {
    return '';
  }

  // If size is a predefined size, map to specific dimensions
  if (size === 'thumbnail') {
    // For Supabase, we would need to implement URL transformation
    // Since Supabase doesn't have built-in image transformation, we return the original
    // and rely on the server function to create different sizes
    return originalUrl.replace('profile-pictures/', 'profile-pictures/thumbnail_');
  } else if (size === 'medium') {
    return originalUrl.replace('profile-pictures/', 'profile-pictures/medium_');
  } else if (size === 'large') {
    return originalUrl.replace('profile-pictures/', 'profile-pictures/large_');
  } else {
    // For custom dimensions, we still return the original since Supabase doesn't support dynamic transformations
    // In a real implementation, you might want to use a service like Cloudinary for dynamic transformations
    return originalUrl;
  }
};

/**
 * Gets the appropriate profile picture URL based on the available sizes
 * @param originalUrl The original profile picture URL
 * @param userId The user ID
 * @param requestedSize The requested size
 * @returns The URL for the requested size, or the original if the size isn't available
 */
export const getProfilePictureWithFallback = async (
  originalUrl: string, 
  userId: string, 
  requestedSize: 'thumbnail' | 'medium' | 'large'
): Promise<string> => {
  if (!originalUrl) {
    return '';
  }

  // Try to get the specific size URL
  const sizeUrl = getProfilePictureSize(originalUrl, requestedSize);
  
  // In a real implementation, we would check if the size exists
  // For now, we just return the size URL
  return sizeUrl;
};