-- Enhance security policies for profile pictures

-- Update storage policies with more specific security rules
CREATE OR REPLACE FUNCTION is_profile_owner()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT auth.uid() = owner FROM storage.objects WHERE id = (SELECT id FROM storage.objects WHERE bucket_id = 'profile-pictures' LIMIT 1));
END;
$$;

-- Update the storage policies for more granular control
DROP POLICY IF EXISTS "Users can upload profile pictures" ON storage.objects;
CREATE POLICY "Users can upload profile pictures" ON storage.objects FOR INSERT
 WITH CHECK (
    bucket_id = 'profile-pictures' 
    AND auth.role() = 'authenticated'
    AND (SELECT id FROM auth.users WHERE id = auth.uid()) IS NOT NULL
    -- Ensure the file path starts with the user's ID
    AND (storage.objects.name ILIKE CONCAT(auth.uid(), '/%'))
  );

DROP POLICY IF EXISTS "Users can update own profile pictures" ON storage.objects;
CREATE POLICY "Users can update own profile pictures" ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-pictures' 
    AND auth.uid() = owner
    AND (storage.objects.name ILIKE CONCAT(auth.uid(), '/%'))
  );

DROP POLICY IF EXISTS "Users can delete own profile pictures" ON storage.objects;
CREATE POLICY "Users can delete own profile pictures" ON storage.objects FOR DELETE
 USING (
    bucket_id = 'profile-pictures' 
    AND auth.uid() = owner
    AND (storage.objects.name ILIKE CONCAT(auth.uid(), '/%'))
  );

-- Enhanced function to validate profile picture updates
CREATE OR REPLACE FUNCTION validate_profile_picture_update(user_id UUID, new_filename TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
 existing_filename TEXT;
BEGIN
  -- Check if the user is authenticated and matches the requested user_id
  IF auth.uid() != user_id THEN
    RETURN FALSE;
  END IF;

  -- Verify the filename format (should be user_id/timestamp_filename.ext)
  IF new_filename NOT ILIKE CONCAT(user_id, '/%') THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$;

-- Create a trigger function to validate profile picture uploads
CREATE OR REPLACE FUNCTION validate_profile_picture_upload()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the authenticated user ID
  user_id := auth.uid();

  -- Validate that the file path matches the user ID
  IF NEW.name NOT ILIKE CONCAT(user_id, '/%') THEN
    RAISE EXCEPTION 'Filename must start with user ID';
  END IF;

  -- Validate file type
  IF NEW.name ILIKE '%.exe' OR NEW.name ILIKE '%.bat' OR NEW.name ILIKE '%.sh' OR NEW.name ILIKE '%.js' THEN
    RAISE EXCEPTION 'Invalid file type';
  END IF;

  RETURN NEW;
END;
$$;

-- Apply the trigger to the profile-pictures bucket
DROP TRIGGER IF EXISTS validate_profile_picture_upload_trigger ON storage.objects;
CREATE TRIGGER validate_profile_picture_upload_trigger
  BEFORE INSERT ON storage.objects
 FOR EACH ROW
  WHEN (NEW.bucket_id = 'profile-pictures')
  EXECUTE FUNCTION validate_profile_picture_upload();

-- Update the update_profile_picture_metadata function to include validation
CREATE OR REPLACE FUNCTION update_profile_picture_metadata(user_id UUID, filename TEXT, file_size INTEGER, file_type TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
 -- Validate that the user is authenticated and matches the target user_id
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Unauthorized: Cannot update profile picture for another user';
  END IF;

 -- Validate filename format
  IF filename NOT ILIKE CONCAT(user_id, '/%') THEN
    RAISE EXCEPTION 'Invalid filename format';
  END IF;

  -- Validate file type
  IF file_type NOT IN ('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp') THEN
    RAISE EXCEPTION 'Invalid file type';
  END IF;

 -- Validate file size (max 5MB)
  IF file_size > 5242880 THEN
    RAISE EXCEPTION 'File size exceeds 5MB limit';
  END IF;

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