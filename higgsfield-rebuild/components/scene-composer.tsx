"use client";

import { useCallback, useId, useRef, useState } from "react";
import Image from "next/image";
import { PlusIcon, WarningIcon, XIcon, SwapIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const MAX_CHARS = 300;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"] as const;
const ACCEPT_ATTR = "image/jpeg,image/png,image/webp";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

type Props = {
  prompt: string;
  onPromptChange: (value: string) => void;
  imageDataUrl: string | null;
  onImageChange: (dataUrl: string | null) => void;
};

/**
 * Scene composer (spec: Compose sections 1 + 2, merged). Prompt and reference
 * image are grouped as one "scene inputs" block: a required subject textarea
 * with the optional reference image attached as a compact chip in the footer.
 * The image is decorative — it never feeds the mocked result. Camera-move names
 * are never inserted here; movement is controlled by the sequence below.
 */
export function SceneComposer({ prompt, onPromptChange, imageDataUrl, onImageChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const id = useId();
  const errorId = `${id}-err`;

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
        onImageChange(typeof reader.result === "string" ? reader.result : null);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    },
    [onImageChange],
  );

  const clearImage = useCallback(() => {
    onImageChange(null);
    setFileName(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [onImageChange]);

  return (
    <div className="space-y-2">
      <p id={`${id}-help`} className="text-xs text-ink-faint">
        Describe what appears in the shot. Camera movement is controlled below.
      </p>
      
      {/* Composer surface: textarea + footer with the image chip and count. */}
      <div className="rounded-md border border-line bg-surface focus-within:border-line-strong">
        <textarea
          id={id}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value.slice(0, MAX_CHARS))}
          rows={3}
          maxLength={MAX_CHARS}
          placeholder="A cyclist crossing an empty city street at dusk..."
          aria-describedby={`${id}-help`}
          className="w-full resize-y bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
        />

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

        <div className="flex items-center justify-between gap-3 border-t border-line px-2 py-2">
          {imageDataUrl ? (
            // Selected: compact attachment chip with thumbnail, replace, remove.
            <div className="flex min-w-0 items-center gap-2 rounded-sm border border-line bg-surface-2 py-1 pl-1 pr-2">
              <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-[4px] border border-line">
                <Image src={imageDataUrl} alt="Reference thumbnail" fill unoptimized className="object-cover" />
              </span>
              <span className="truncate text-xs text-ink">{fileName ?? "Reference image"}</span>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="shrink-0 text-xs text-ink-muted underline-offset-2 hover:text-ink hover:underline"
              >
                <SwapIcon size={13} weight="bold" aria-hidden />
              </button>
              <button
                type="button"
                onClick={clearImage}
                aria-label="Remove reference image"
                className="grid h-5 w-5 shrink-0 place-items-center rounded-sm text-ink-faint hover:bg-surface-3 hover:text-ink"
              >
                <XIcon size={13} weight="bold" aria-hidden />
              </button>
            </div>
          ) : (
            // Empty: add-reference chip.
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-describedby={error ? errorId : undefined}
              className="inline-flex items-center gap-1.5 rounded-sm border border-dashed border-line px-2.5 py-1.5 text-xs text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              <PlusIcon size={13} weight="bold" aria-hidden />
              Reference image
              <span className="text-ink-faint">· Optional</span>
            </button>
          )}

          <span
            aria-live="polite"
            className="shrink-0 font-mono text-xs text-ink-faint tabular-nums"
          >
            {prompt.length} / {MAX_CHARS}
          </span>
        </div>
      </div>

      {error && (
        <p id={errorId} role="alert" className="flex items-center gap-1.5 text-xs text-danger">
          <WarningIcon size={14} weight="fill" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
