"use client";

import Image from "next/image";
import { useImageUpload } from "@/hooks/useImageUpload";
import { POST_RULES } from "@/lib/blog/rules";
import { parseOwnImageUrl } from "@/lib/images/imageUrl";
import { IMAGE_BASE_URL } from "@/lib/images/publicConfig";
import { ui } from "../../../_components/ui";
import { uploadImageAction } from "../actions";
import { TextField } from "./TextField";

const ACCEPT = "image/jpeg,image/png,image/webp";
const PREVIEW_SIZES = "(max-width: 768px) 100vw, 480px";
const FALLBACK_SIZE = { width: 480, height: 270 };

interface Props {
  url: string;
  alt: string;
  onUrlChange: (url: string) => void;
  onAltChange: (alt: string) => void;
  error?: string;
  altError?: string;
}

export function CoverImageField({ url, alt, onUrlChange, onAltChange, error, altError }: Props) {
  const { upload, pending, error: uploadError } = useImageUpload(uploadImageAction);
  const size = parseOwnImageUrl(url, IMAGE_BASE_URL) ?? FALLBACK_SIZE;

  return (
    <fieldset className="space-y-3">
      <legend className={ui.label}>Imagen de portada</legend>
      <input type="hidden" name="coverUrl" value={url} />

      {url ? (
        <div className="relative max-w-md overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          <Image src={url} alt="" width={size.width} height={size.height} sizes={PREVIEW_SIZES} className="h-auto w-full object-cover" />
        </div>
      ) : (
        <p className="text-sm text-slate-600">Sin portada. Recomendado: 1200×630 px o más (se usa en Google y redes).</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <label className={`${ui.buttonSecondary} cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-orange`}>
          {pending ? "Subiendo…" : url ? "Cambiar imagen" : "Subir imagen"}
          <input
            type="file"
            accept={ACCEPT}
            className="sr-only"
            disabled={pending}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file, (img) => onUrlChange(img.url));
              e.target.value = "";
            }}
          />
        </label>
        {url && (
          <button type="button" className={ui.buttonDanger} onClick={() => onUrlChange("")}>
            Quitar
          </button>
        )}
      </div>
      {(uploadError || error) && (
        <p className={ui.error} role="alert">
          {uploadError ?? error}
        </p>
      )}

      <TextField
        name="coverAlt"
        label="Texto alternativo de la portada"
        value={alt}
        onChange={onAltChange}
        error={altError}
        hint="Describe la imagen para Google y lectores de pantalla."
        counter={{ max: POST_RULES.imageAlt.max }}
      />
    </fieldset>
  );
}
