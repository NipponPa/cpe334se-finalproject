import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1";

// This function processes profile images after upload
// It resizes the image and creates different sizes for various use cases
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

    // Only process images in the profile-pictures bucket
    if (bucket.name !== "profile-pictures") {
      return new Response(JSON.stringify({ message: "Not a profile picture, skipping processing" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get the uploaded image
    const { data: imageData, error: downloadError } = await supabase.storage
      .from(bucket.name)
      .download(record.name);

    if (downloadError) {
      throw new Error(`Error downloading image: ${downloadError.message}`);
    }

    // Convert to array buffer for processing
    const imageBuffer = await imageData.arrayBuffer();

    // Import image processing library
    const { default: sharp } = await import("https://esm.sh/sharp@0.32.6");
    
    // Process the image to create different sizes
    const originalImage = sharp(imageBuffer);
    const metadata = await originalImage.metadata();
    
    // Create different sizes: thumbnail (64x64), medium (200x200), large (500x500)
    const sizes = [
      { name: 'thumbnail', size: 64 },
      { name: 'medium', size: 200 },
      { name: 'large', size: 500 }
    ];

    // Extract user ID from the file path (format: userId/timestamp_filename.ext)
    const filePathParts = record.name.split('/');
    const userId = filePathParts[0];
    const fileNameWithExt = filePathParts[1];
    const fileExtension = fileNameWithExt.split('.').pop();
    
    // Process and upload each size
    for (const { name, size } of sizes) {
      const resizedImageBuffer = await originalImage
        .resize(size, size, { fit: 'cover', position: 'center' })
        .toFormat(fileExtension as 'jpeg' | 'png' | 'gif' | 'webp')
        .toBuffer();

      // Create new filename with size designation
      const sizedFileName = `${userId}/${name}_${fileNameWithExt}`;
      
      // Upload the resized image
      const { error: uploadError } = await supabase.storage
        .from(bucket.name)
        .upload(sizedFileName, resizedImageBuffer, {
          upsert: true,
          contentType: `image/${fileExtension}`
        });

      if (uploadError) {
        console.error(`Error uploading ${name} size:`, uploadError);
      }
    }

    return new Response(
      JSON.stringify({ 
        message: "Profile image processed successfully", 
        userId,
        originalFile: record.name,
        sizesProcessed: sizes.map(s => s.name)
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Error processing profile image:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});