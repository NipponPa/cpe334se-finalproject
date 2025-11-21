# Profile Picture System Design

## Current State Analysis

The existing system already has:
- A `users` table with an `avatar_url` column (line 9 in `01_initial_schema.sql`)
- Supabase authentication with email/password and Google OAuth support
- An `AuthContext` managing authentication state
- A `handle_new_user()` function that creates user records when they sign up

## Proposed Architecture

### 1. Database Schema
The current schema already has an `avatar_url` column in the `users` table, but we should enhance it with additional fields for better profile picture management:

```sql
-- The users table already has:
-- avatar_url TEXT

-- We'll enhance the existing users table by adding:
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS profile_image_filename TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS profile_image_size INTEGER;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS profile_image_type TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS profile_image_updated_at TIMESTAMP WITH TIME ZONE;
```

### 2. Supabase Storage Setup
- Create a dedicated storage bucket for profile pictures called `profile-pictures`
- Configure security policies to ensure users can only upload/update their own profile pictures
- Set up automatic image optimization using Supabase Functions

### 3. Storage Policies
- Users can only upload/update files in the `profile-pictures` bucket if the filename matches their user ID
- Only the user themselves or administrative functions can modify their profile picture
- Set file size limits and accepted file types (JPEG, PNG, GIF, WEBP)

### 4. Client-Side Components
- Create a profile picture upload component with drag-and-drop support
- Implement image preview and cropping functionality
- Add progress indicators for upload operations
- Create a profile picture display component that handles loading states and fallbacks

### 5. Image Processing
- Client-side image resizing before upload to optimize for web display
- Server-side optimization using Supabase Functions to ensure consistent image quality
- Generate multiple sizes of profile pictures (thumbnail, medium, large) for different use cases

### 6. Google OAuth Integration
- When a user logs in via Google OAuth, check if they have a profile picture set
- If no custom profile picture exists, use their Google profile image as the default
- Allow users to override the Google profile image with a custom upload

### 7. Security Considerations
- Implement file type validation to prevent malicious uploads
- Limit file size to prevent abuse
- Use signed URLs for temporary access to private images
- Ensure proper RLS policies are in place

### 8. Default/Placeholder Images
- Implement a default avatar system for users without profile pictures
- Use different placeholder images based on user preferences or randomly selected avatars
- Consider using identicons based on user IDs for unique default avatars

### 9. Scalability Considerations
- Use CDN for profile picture delivery
- Implement caching strategies for profile pictures
- Optimize image formats and sizes for faster loading
- Consider lazy loading for profile pictures in lists

## Implementation Plan

### Phase 1: Database and Storage Setup
1. Create the `profile-pictures` storage bucket in Supabase
2. Enhance the `users` table with additional profile picture metadata columns
3. Set up RLS policies for secure access

### Phase 2: Server-Side Logic
1. Create Supabase Functions for image processing
2. Implement security validation for uploads
3. Set up automatic thumbnail generation

### Phase 3: Client-Side Components
1. Create profile picture upload component
2. Update navigation bar to display profile pictures
3. Implement profile page with picture management

### Phase 4: OAuth Integration
1. Enhance Google OAuth callback to handle profile pictures
2. Implement logic to use Google profile image as default

### Phase 5: Testing and Optimization
1. Test with various image formats and sizes
2. Optimize for performance and user experience
3. Add error handling and fallback mechanisms