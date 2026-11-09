/**
 * Public base URL of uploaded images (S3), e.g.
 * https://<bucket>.s3.<region>.amazonaws.com. NEXT_PUBLIC_ so the editor
 * preview can render uploads client-side; it is not a secret.
 */
export const IMAGE_BASE_URL: string | null = process.env.NEXT_PUBLIC_IMAGE_BASE_URL?.replace(/\/+$/, "") || null;
