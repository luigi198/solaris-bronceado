/**
 * Upload shapes shared by the image service, the upload Server Action and the
 * client hook. Type/constant only — safe to import from client components.
 */

/** MIME types the upload pipeline accepts (see sniffFormat in processImage.ts). */
export const UPLOAD_ACCEPT = "image/jpeg,image/png,image/webp";

export interface UploadedImage {
  url: string;
  width: number;
  height: number;
}

export type UploadResult = ({ ok: true } & UploadedImage) | { ok: false; error: string };
