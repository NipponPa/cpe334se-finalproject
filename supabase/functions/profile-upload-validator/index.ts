import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1";

// This function validates profile picture uploads before they're processed
serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const authHeader = req.headers.get("Authorization")!;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { record, bucket } = await req.json();

    // Only validate images in the profile-pictures bucket
    if (bucket.name !== "profile-pictures") {
      return new Response(JSON.stringify({ message: "Not a profile picture, skipping validation" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Extract user ID from the file path (format: userId/timestamp_filename.ext)
    const filePathParts = record.name.split('/');
    const userIdFromPath = filePathParts[0];
    
    // Get user information to verify the upload is valid
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userIdFromPath)
      .single();

    if (userError || !userData) {
      // Delete the unauthorized file
      await supabase.storage
        .from(bucket.name)
        .remove([record.name]);
      
      return new Response(
        JSON.stringify({ 
          error: "Unauthorized: User does not exist or does not match file path" 
        }),
        { 
          status: 403, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    // Validate file name format and content
    const fileName = filePathParts.slice(1).join('/'); // Get everything after the user ID
    if (!fileName.match(/^[a-zA-Z0-9._-]+\.(jpeg|jpg|png|gif|webp)$/i)) {
      // Delete the invalid file
      await supabase.storage
        .from(bucket.name)
        .remove([record.name]);
      
      return new Response(
        JSON.stringify({ 
          error: "Invalid file name format" 
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    // Additional validation: check if file size is reasonable
    if (record.size > 5 * 1024 * 1024) { // 5MB
      // Delete the oversized file
      await supabase.storage
        .from(bucket.name)
        .remove([record.name]);
      
      return new Response(
        JSON.stringify({ 
          error: "File size exceeds 5MB limit" 
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    // Update the user's profile with the new avatar URL and metadata
    const fileExtension = fileName.split('.').pop();
    const publicUrl = `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/profile-pictures/${record.name}`;
    
    const { error: updateUserError } = await supabase
      .from('users')
      .update({
        avatar_url: publicUrl,
        profile_image_filename: record.name,
        profile_image_size: record.size,
        profile_image_type: getMimeType(fileExtension),
        profile_image_updated_at: new Date().toISOString()
      })
      .eq('id', userIdFromPath);

    if (updateUserError) {
      return new Response(
        JSON.stringify({ 
          error: `Database update failed: ${updateUserError.message}` 
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: "Profile picture uploaded and validated successfully", 
        userId: userIdFromPath,
        fileName: record.name,
        fileSize: record.size
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Error validating profile picture upload:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
});

// Helper function to get MIME type from file extension
function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp'
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
}