import { createHash } from "crypto";

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

function signParams(params: Record<string, string>): string {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1")
    .update(sorted + API_SECRET!)
    .digest("hex");
}

/**
 * Cloudinary bloque souvent les PDF : on convertit en PNG pour prévisualisation.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ publicId: string; url: string; mimeType: string }> {
  if (!CLOUD || !API_KEY || !API_SECRET) {
    throw new Error("Cloudinary non configuré.");
  }

  const isPdf = mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");
  const timestamp = String(Math.floor(Date.now() / 1000));
  const folder = "f2m-candidats";

  const params: Record<string, string> = {
    timestamp,
    folder,
  };

  if (isPdf) {
    params.format = "png";
    params.pages = "all";
  }

  const signature = signParams(params);

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(buffer)], { type: mimeType }), fileName);
  form.append("api_key", API_KEY);
  form.append("timestamp", timestamp);
  form.append("signature", signature);
  form.append("folder", folder);
  if (isPdf) {
    form.append("format", "png");
    form.append("pages", "all");
  }

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`, {
    method: "POST",
    body: form,
  });

  const data = (await res.json()) as {
    public_id?: string;
    secure_url?: string;
    error?: { message?: string };
  };

  if (!res.ok || !data.secure_url || !data.public_id) {
    throw new Error(data.error?.message ?? "Échec upload Cloudinary.");
  }

  return {
    publicId: data.public_id,
    url: data.secure_url,
    mimeType: isPdf ? "image/png" : mimeType,
  };
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  if (!CLOUD || !API_KEY || !API_SECRET) return;

  const timestamp = String(Math.floor(Date.now() / 1000));
  const params = { public_id: publicId, timestamp };
  const signature = signParams(params);

  const body = new URLSearchParams({
    public_id: publicId,
    api_key: API_KEY,
    timestamp,
    signature,
  });

  await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/destroy`, {
    method: "POST",
    body,
  });
}
