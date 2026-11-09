"use client";

import { useState, useTransition } from "react";

export type ImageUploader = (formData: FormData) => Promise<
  { ok: true; url: string; width: number; height: number } | { ok: false; error: string }
>;

export interface UploadedImage {
  url: string;
  width: number;
  height: number;
}

/** Wraps an upload Server Action with pending/error state for file inputs. */
export function useImageUpload(uploader: ImageUploader) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function upload(file: File, onDone: (image: UploadedImage) => void): void {
    setError(null);
    const data = new FormData();
    data.set("file", file);
    startTransition(async () => {
      try {
        const result = await uploader(data);
        if (result.ok) onDone({ url: result.url, width: result.width, height: result.height });
        else setError(result.error);
      } catch {
        setError("No se pudo subir la imagen. Revisa tu conexión e intenta de nuevo.");
      }
    });
  }

  return { upload, pending, error };
}
