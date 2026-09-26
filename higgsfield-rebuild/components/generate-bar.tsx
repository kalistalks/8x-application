"use client";

import { FilmSlate } from "@phosphor-icons/react";
import type { SequenceItem } from "@/lib/types";
import { getMoveName } from "@/lib/moves";
import { cn } from "@/lib/utils";

type Props = {
  prompt: string;
  sequence: SequenceItem[];
  onGenerate: () => void;
};

/**
 * Generate action (spec: Compose section 5). Single primary button, disabled
 * until the scene has a subject description AND at least one move is queued.
 * Shows a compact text summary of the queued sequence and why it's blocked.
 */
export function GenerateBar({ prompt, sequence, onGenerate }: Props) {
  const hasMoves = sequence.length > 0;
  const hasPrompt = prompt.trim().length > 0;
  const ready = hasMoves && hasPrompt;
  const summary = sequence.map((s) => getMoveName(s.moveId)).join(" → ");

  // A single, specific reason when the action is blocked.
  const blockedReason = !hasPrompt
    ? "Describe your scene to generate."
    : "Add at least one move to generate.";

  return (
    <div className="flex flex-col gap-3 rounded-md border border-line bg-surface/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-ink-faint">
          {sequence.length} {sequence.length === 1 ? "move" : "moves"} queued
        </p>
        <p className={cn("mt-0.5 truncate text-sm", ready ? "text-ink" : "text-ink-faint")}>
          {ready ? summary : blockedReason}
        </p>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={!ready}
        aria-label={ready ? `Generate shot with sequence ${summary}` : `Generate — ${blockedReason}`}
        className={cn(
          "inline-flex shrink-0 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors",
          ready
            ? "bg-accent text-accent-ink hover:bg-accent-hover"
            : "cursor-not-allowed border border-line bg-surface text-ink-faint",
        )}
      >
        <FilmSlate size={17} weight="fill" aria-hidden />
        Generate
      </button>
    </div>
  );
}
