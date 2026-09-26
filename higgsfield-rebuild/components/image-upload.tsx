"use client";

import { useCallback, useId, useRef, useState } from "react";
import Image from "next/image";
import { UploadSimple, X, ImageSquare, Warning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"] as const;
const ACCEPT_ATTR = "image/jpeg,image/png,image/webp";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

type Props = {
  /** Current image as a data URL, or null when empty. Owned by the parent. */
  value: string | null;
  /** Called with a data URL when a valid image is chosen, or null when cleared. */
  onChange: (dataUrl: string | null) => void;
};

/**
 * Single-image upload (spec: Compose section 1). Click-to-browse or drag-and-drop,
 * one file only. Validates type (jpg/png/webp) and size, shows a clear inline
 * error on rejection, and renders a small thumbnail once selected. The image is
 * intentionally decorative — it never feeds the mocked result.
 */
export function ImageUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const errorId = useId();

  const validateAndLoad = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED.includes(file.type as (typeof ACCEPTED)[number])) {
        setError("Unsupported file type. Use a JPG, PNG, or WebP image.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("That image is over 10 MB. Choose a smaller file.");
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => setError("Could not read that file. Try another image.");
      reader.onload = () => {
        onChange(typeof reader.result === "string" ? reader.result : null);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) validateAndLoad(file);
    },
    [validateAndLoad],
  );

  const clear = useCallback(() => {
    onChange(null);
    setFileName(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [onChange]);

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) validateAndLoad(file);
        }}
      />

      {value ? (
        // Selected: thumbnail preview + filename + clear.
        <div className="flex items-center gap-3 rounded-md border border-line bg-surface p-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-line">
            {/* Data-URL preview; unoptimized since it's a client-side blob. */}
            <Image src={value} alt="Uploaded reference" fill unoptimized className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-ink">{fileName ?? "Reference image"}</p>
            <p className="text-xs text-ink-faint">Reference only — not used in the result.</p>
          </div>
          <button
            type="button"
            onClick={clear}
            aria-label="Remove uploaded image"
            className="grid h-8 w-8 place-items-center rounded-sm border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            <X size={16} weight="bold" aria-hidden />
          </button>
        </div>
      ) : (
        // Empty: click / drop zone.
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "flex w-full flex-col items-center gap-2 rounded-md border border-dashed px-4 py-8 text-center transition-colors",
            dragging
              ? "border-accent bg-accent/5"
              : "border-line bg-surface/40 hover:border-line-strong hover:bg-surface",
          )}
        >
          <span
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full border transition-colors",
              dragging ? "border-accent text-accent" : "border-line text-ink-muted",
            )}
          >
            {dragging ? <ImageSquare size={20} aria-hidden /> : <UploadSimple size={20} aria-hidden />}
          </span>
          <span className="text-sm text-ink">
            {dragging ? "Drop to upload" : "Drag an image here, or click to browse"}
          </span>
          <span className="text-xs text-ink-faint">JPG, PNG, or WebP · up to 10 MB · one file</span>
        </button>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-xs text-danger"
        >
          <Warning size={14} weight="fill" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
