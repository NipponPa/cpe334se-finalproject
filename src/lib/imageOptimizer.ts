/**
 * Optimizes an image file by resizing and compressing it
 * @param file The image file to optimize
 * @param maxWidth The maximum width for the optimized image
 * @param maxHeight The maximum height for the optimized image
 * @param quality The quality level for compression (0-1)
 * @returns A Promise that resolves to the optimized Blob
 */
export const optimizeImage = (
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Get the optimized image as a blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Could not create optimized image'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = (error) => {
      reject(error);
    };
  });
};

/**
 * Converts a File object to a Data URL
 * @param file The file to convert
 * @returns A Promise that resolves to the Data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Validates an image file
 * @param file The file to validate
 * @returns An object with validation results and error message if any
 */
export const validateImageFile = (file: File) => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only JPEG, PNG, GIF, and WEBP files are allowed.'
    };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
 if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size exceeds 5MB limit'
    };
  }

  return { isValid: true, error: null };
};