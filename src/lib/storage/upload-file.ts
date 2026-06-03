import { pickStorageProvider } from "./detect";
import { uploadToCloudinary } from "./cloudinary-upload";
import { uploadToSupabaseStorage } from "./supabase-upload";
import type { DocumentStorage } from "@/types";

export interface UploadedFileResult {
  storage: DocumentStorage;
  storagePath: string;
  url: string;
  mimeType: string;
}

export async function uploadCandidatFile(
  candidatId: string,
  fileName: string,
  buffer: Buffer,
  mimeType: string
): Promise<UploadedFileResult> {
  const provider = pickStorageProvider(mimeType, fileName);

  if (provider === "supabase") {
    const { path, url } = await uploadToSupabaseStorage(candidatId, fileName, buffer, mimeType);
    return { storage: "supabase", storagePath: path, url, mimeType };
  }

  const cloud = await uploadToCloudinary(buffer, fileName, mimeType);
  return {
    storage: "cloudinary",
    storagePath: cloud.publicId,
    url: cloud.url,
    mimeType: cloud.mimeType,
  };
}
