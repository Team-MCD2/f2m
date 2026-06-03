import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "candidat-documents";

export async function uploadToSupabaseStorage(
  candidatId: string,
  fileName: string,
  buffer: Buffer,
  mimeType: string
): Promise<{ path: string; url: string }> {
  const supabase = createServiceClient();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${candidatId}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: mimeType,
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload Supabase : ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function deleteFromSupabaseStorage(storagePath: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
  if (error) throw new Error(`Suppression Supabase : ${error.message}`);
}
