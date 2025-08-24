// helper/uploadpfp.ts
import { createClient } from "@/utils/supabase/server";

export const uploadUserPfp = async (userId: string, file: File | null) => {
  if (!file) throw new Error("No file provided");

  const supabase = await createClient(); // ✅ uses server-side supabase client

  const buffer = await file.arrayBuffer();
  const filePath = `avatars/${userId}_${file.name}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true, // overwrite if exists
    });

  if (error) {
    console.error("Upload Error:", error);
    throw new Error("Failed to upload image");
  }

  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return urlData.publicUrl;
};
