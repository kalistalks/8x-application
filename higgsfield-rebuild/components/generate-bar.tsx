"use client";

import { FilmSlate } from "@phosphor-icons/react";
import type { SequenceItem } from "@/lib/types";
import { getMoveName } from "@/lib/moves";
import { cn } from "@/lib/utils";

type Props = {
  sequence: SequenceItem[];
  onGenerate: () => void;
};

/**
 * Generate action (spec: Compose section 5). Single primary button, disabled
 * until at least one move is queued (the subject prompt is optional, so gating
 * is on moves only). Shows a compact text summary of the queued sequence.
 */
export function GenerateBar({ sequence, onGenerate }: Props) {
  const hasMoves = sequence.length > 0;
  const summary = sequence.map((s) => getMoveName(s.moveId)).join(" → ");

  return (
    <div className="flex flex-col gap-3 rounded-md border border-line bg-surface/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-ink-faint">Queued sequence</p>
        <p className={cn("mt-0.5 truncate text-sm", hasMoves ? "text-ink" : "text-ink-faint")}>
          {hasMoves ? summary : "Add at least one move to generate."}
        </p>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={!hasMoves}
        aria-label={
          hasMoves
            ? `Generate shot with sequence ${summary}`
            : "Generate — add at least one move first"
        }
        className={cn(
          "inline-flex shrink-0 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors",
          hasMoves
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
