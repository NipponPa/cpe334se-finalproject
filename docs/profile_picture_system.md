# Profile Picture Upload System

## Overview

This system provides a complete solution for user profile picture management in the Supabase-based calendar application. It includes secure upload, storage, optimization, and display functionality.

## Features

1. **Secure Upload**: Validates file types, sizes, and user authentication
2. **Image Optimization**: Client-side compression and resizing before upload
3. **Multiple Sizes**: Automatic generation of thumbnail, medium, and large sizes
4. **OAuth Integration**: Automatically uses Google profile images as defaults
5. **Responsive Display**: Profile pictures display properly across all device sizes
6. **Security**: Multiple layers of validation and access control

## Architecture

### Database Schema

- Enhanced `users` table with profile picture metadata:
  - `avatar_url`: Public URL of the profile picture
  - `profile_image_filename`: Storage bucket filename
  - `profile_image_size`: File size in bytes
 - `profile_image_type`: MIME type of the image
  - `profile_image_updated_at`: Timestamp of last update

### Storage

- Dedicated `profile-pictures` storage bucket
- User-specific folders (e.g., `user-id/timestamp_filename.ext`)
- Public access for profile pictures
- Secure upload policies

### Server-Side Components

1. **Database Migrations**:
   - `02_profile_pictures_schema.sql`: Creates storage bucket and enhances user table
   - `03_profile_pictures_security.sql`: Implements security policies

2. **Supabase Functions**:
   - `profile-image-processor`: Optimizes images and generates multiple sizes
   - `profile-upload-validator`: Validates uploads with additional security checks

### Client-Side Components

1. **Utility Functions**:
   - `profilePictureUtils.ts`: Core upload/delete functionality
   - `imageOptimizer.ts`: Client-side image optimization
   - `profilePictureSizes.ts`: Size management utilities

2. **UI Components**:
   - `ProfilePictureUpload.tsx`: Upload interface with drag-and-drop
   - `ProfilePictureDisplay.tsx`: Responsive profile picture display
   - Integrated into `NavigationBar.tsx` for global access

## Security Measures

1. **File Validation**:
   - Type checking (JPEG, PNG, GIF, WEBP only)
   - Size limits (5MB maximum)
   - Filename validation

2. **Access Control**:
   - Row Level Security (RLS) policies
   - User-specific storage paths
   - Authentication required for all operations

3. **Server-Side Validation**:
   - Supabase functions validate uploads
   - Database triggers enforce constraints
   - Automatic cleanup of unauthorized files

## OAuth Integration

- Google OAuth users automatically get their profile image set as default
- Users can override OAuth images with custom uploads
- Profile image persistence across sessions

## Usage

### For Developers

1. The system automatically integrates with existing Supabase authentication
2. Profile pictures are accessible via the `/profile` route
3. Use `ProfilePictureDisplay` component anywhere you need to show a user's avatar
4. Upload functionality is available via `uploadProfilePicture` utility function

### For Users

1. Navigate to the Profile page or click your avatar in the navigation bar
2. Click on the profile picture area or drag and drop an image
3. Select your desired image file (JPEG, PNG, GIF, or WEBP)
4. Click "Upload Picture" to save
5. The new profile picture will appear throughout the application

## Error Handling

- File type validation with clear error messages
- Size limit enforcement
- Network error handling during upload
- Fallback to default avatars when images fail to load
- Automatic cleanup of failed uploads

## Performance Considerations

- Client-side optimization reduces upload time
- CDN delivery for profile pictures
- Multiple sizes available for different contexts
- Lazy loading for profile pictures in lists