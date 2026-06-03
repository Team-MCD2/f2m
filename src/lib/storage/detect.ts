const PDF_MIMES = new Set(["application/pdf", "application/x-pdf"]);

export function isPdfFile(mimeType: string, fileName: string): boolean {
  const mime = mimeType.toLowerCase();
  if (PDF_MIMES.has(mime)) return true;
  return fileName.toLowerCase().endsWith(".pdf");
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

/** PDF → Supabase ; autres → Cloudinary si configuré, sinon Supabase */
export function pickStorageProvider(mimeType: string, fileName: string): "supabase" | "cloudinary" {
  if (isPdfFile(mimeType, fileName)) return "supabase";
  if (isCloudinaryConfigured()) return "cloudinary";
  return "supabase";
}

export const MAX_FILE_BYTES = 20 * 1024 * 1024;

export const ALLOWED_MIME_PREFIXES = [
  "application/pdf",
  "image/",
  "application/msword",
  "application/vnd.openxmlformats-officedocument",
  "text/plain",
];

export function isAllowedMime(mimeType: string): boolean {
  const mime = mimeType.toLowerCase();
  return ALLOWED_MIME_PREFIXES.some((p) => mime.startsWith(p) || mime === p);
}
