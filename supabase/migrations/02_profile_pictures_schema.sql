-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('profile-pictures', 'profile-pictures', true, false, 5242880, '{image/png,image/jpeg,image/gif,image/webp}');

-- Enhance users table with profile picture metadata
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS profile_image_filename TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS profile_image_size INTEGER;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS profile_image_type TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS profile_image_updated_at TIMESTAMP WITH TIME ZONE;

-- Update RLS policies to allow users to update their own profile picture info
CREATE POLICY "Users can update own profile picture" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create function to update profile picture metadata when user uploads a new image
CREATE OR REPLACE FUNCTION update_profile_picture_metadata(user_id UUID, filename TEXT, file_size INTEGER, file_type TEXT)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.users 
  SET 
    avatar_url = CONCAT('https://', current_setting('app.supabase_base_url'), '/storage/v1/object/public/profile-pictures/', filename),
    profile_image_filename = filename,
    profile_image_size = file_size,
    profile_image_type = file_type,
    profile_image_updated_at = NOW()
  WHERE id = user_id;
END;
$$;

-- Create function to handle profile picture deletion
CREATE OR REPLACE FUNCTION delete_profile_picture(user_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.users 
  SET 
    avatar_url = NULL,
    profile_image_filename = NULL,
    profile_image_size = NULL,
    profile_image_type = NULL,
    profile_image_updated_at = NULL
  WHERE id = user_id;
END;
$$;

-- Update the handle_new_user function to include profile picture fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')  -- For OAuth providers
  );
  RETURN NEW;
END;
$$;

-- Storage policies for profile pictures
DROP POLICY IF EXISTS "Users can upload profile pictures" ON storage.objects;
CREATE POLICY "Users can upload profile pictures" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Users can update own profile pictures" ON storage.objects;
CREATE POLICY "Users can update own profile pictures" ON storage.objects FOR UPDATE
  USING (bucket_id = 'profile-pictures' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Users can delete own profile pictures" ON storage.objects;
CREATE POLICY "Users can delete own profile pictures" ON storage.objects FOR DELETE
  USING (bucket_id = 'profile-pictures' AND auth.uid() = owner);

DROP POLICY IF EXISTS "Anyone can read profile pictures" ON storage.objects;
CREATE POLICY "Anyone can read profile pictures" ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-pictures');