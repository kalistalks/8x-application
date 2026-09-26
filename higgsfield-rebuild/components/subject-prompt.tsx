"use client";

import { useId } from "react";

const MAX_CHARS = 500;

type Props = {
  value: string;
  onChange: (value: string) => void;
};

/**
 * Subject prompt field (spec: Compose section 2). One compact textarea for
 * subject + setting only. Camera-move names/tokens are never inserted here —
 * that's the whole point of the redesign; movement is controlled by the
 * sequence below. The prompt is optional. Shows a live character count.
 */
export function SubjectPrompt({ value, onChange }: Props) {
  const id = useId();
  const countId = `${id}-count`;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm text-ink">
        Describe your scene
      </label>

      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
        rows={3}
        maxLength={MAX_CHARS}
        placeholder="A cyclist crossing an empty city street at dusk..."
        aria-describedby={`${id}-help ${countId}`}
        className="w-full resize-y rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-line-strong focus:outline-none"
      />

      <div className="flex items-start justify-between gap-3">
        <p id={`${id}-help`} className="text-xs text-ink-faint">
          Describe what appears in the shot. Camera movement is controlled below.
        </p>
        <span
          id={countId}
          aria-live="polite"
          className="shrink-0 font-mono text-xs text-ink-faint tabular-nums"
        >
          {value.length}/{MAX_CHARS}
        </span>
      </div>
    </div>
  );
}
