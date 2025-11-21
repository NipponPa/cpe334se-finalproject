'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { uploadProfilePicture, deleteProfilePicture } from '@/lib/profilePictureUtils';
import { optimizeImage, validateImageFile } from '@/lib/imageOptimizer';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfilePictureUploadProps {
  onPictureChange?: (newPictureUrl: string | null) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ onPictureChange }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setPreviewUrl(user.user_metadata.avatar_url);
    } else if (user) {
      // Fetch the user's avatar_url from the database since it's not in the auth user object
      const fetchUserAvatar = async () => {
        const { data, error } = await supabase
          .from('users')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
          
        if (data?.avatar_url) {
          setPreviewUrl(data.avatar_url);
        }
      };
      
      fetchUserAvatar();
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the image file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setSelectedFile(file);

    // Create a preview of the selected image
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setSuccess(null);

    try {
      // Optimize the image before upload
      const optimizedBlob = await optimizeImage(selectedFile, 800, 800, 0.8);
      const optimizedFile = new File([optimizedBlob], selectedFile.name, { type: selectedFile.type });

      // Upload the optimized image
      const result = await uploadProfilePicture(optimizedFile);
      
      setSuccess('Profile picture updated successfully!');
      if (onPictureChange) {
        onPictureChange(result.url);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during upload';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
      
      // Reset after a short delay
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      await deleteProfilePicture();
      setPreviewUrl(null);
      setSelectedFile(null);
      setSuccess('Profile picture deleted successfully');
      if (onPictureChange) {
        onPictureChange(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting the profile picture';
      setError(errorMessage);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Create a new event to simulate file input change
      const event = {
        target: {
          files: e.dataTransfer.files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleFileChange(event);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer mb-4"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Profile Preview" 
                className="w-32 h-32 rounded-full object-cover mb-2"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                <span className="text-gray-500">No image</span>
              </div>
            )}
            <p className="text-sm text-gray-600">
              Drag & drop your photo here, or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, GIF, or WEBP (Max 5MB)
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
          />
        </div>

        {isUploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          {selectedFile && !isUploading && (
            <Button 
              onClick={handleUpload}
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? 'Uploading...' : 'Upload Picture'}
            </Button>
          )}
          
          {previewUrl && !isUploading && (
            <Button 
              onClick={handleDelete}
              variant="outline"
              className="flex-1"
            >
              Remove Picture
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePictureUpload;