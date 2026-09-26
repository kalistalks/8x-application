"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CheckIcon } from "@phosphor-icons/react";
import type { SequenceItem } from "@/lib/types";
import { getMove, getMoveName } from "@/lib/moves";
import { MoveGlyph } from "@/components/move-glyph";
import { cn } from "@/lib/utils";

/** The three render stages with their supporting copy (spec section 6). */
const STAGES = [
  {
    title: "Compiling sequence...",
    note: "Locking the order and transitions between your moves.",
  },
  {
    title: "Applying motion...",
    note: "Mapping each move onto the shot according to speed.",
  },
  {
    title: "Rendering...",
    note: "Compositing the final frames of your shot.",
  },
] as const;

/** Total render time — DoD says ~6–8s. Split evenly across the three stages. */
const TOTAL_MS = 6600;
const TICK_MS = 60;

type Props = {
  sequence: SequenceItem[];
  imageDataUrl: string | null;
  onCancel: () => void;
  onComplete: () => void;
};

/**
 * The Generating state (spec: Second screen). Two-column workspace: a preview
 * frame on the left with a scan line sweeping top -> bottom, and staged status +
 * progress on the right. Keeps the queued sequence visible, auto-advances to the
 * Result, and Cancel returns to Compose with state intact.
 */
export function Generating({ sequence, imageDataUrl, onCancel, onComplete }: Props) {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number | null>(null);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    let raf = 0;
    let timer: number;

    const tick = () => {
      if (startRef.current === null) startRef.current = performance.now();
      const elapsed = performance.now() - startRef.current;
      const pct = Math.min(100, (elapsed / TOTAL_MS) * 100);
      setProgress(pct);
      if (pct >= 100) {
        timer = window.setTimeout(() => completeRef.current(), 350);
      } else {
        timer = window.setTimeout(() => (raf = requestAnimationFrame(tick)), TICK_MS);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, []);

  const currentStage = Math.min(STAGES.length - 1, Math.floor((progress / 100) * STAGES.length));
  const rounded = Math.round(progress);

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface/40">
      <div className="grid gap-0 md:grid-cols-2">
        {/* Left: preview frame with scan line. */}
        <div className="relative aspect-video w-full overflow-hidden border-b border-line bg-surface md:border-b-0 md:border-r">
          {imageDataUrl ? (
            <Image src={imageDataUrl} alt="" fill unoptimized className="object-contain opacity-90" />
          ) : (
            // No reference uploaded: show the static preview poster fitted to
            // the frame so nothing is cropped while the render "builds".
            <Image
              src="/preview-poster.jpg"
              alt=""
              fill
              aria-hidden
              className="object-contain opacity-80"
            />
          )}

          {/* Corner brackets. */}
          <Corner className="left-4 top-4 border-l-2 border-t-2" />
          <Corner className="right-4 top-4 border-r-2 border-t-2" />
          <Corner className="bottom-4 left-4 border-b-2 border-l-2" />
          <Corner className="bottom-4 right-4 border-b-2 border-r-2" />

          {/* Scan line sweeping top -> bottom (paused under reduced motion). */}
          {!reduce && (
            <span
              aria-hidden
              className="scan-line absolute inset-x-0 h-px bg-accent shadow-[0_0_12px_2px_rgba(198,242,78,0.55)]"
            />
          )}

          <span className="absolute left-4 top-4 translate-x-3 rounded-sm bg-canvas/70 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-ink-muted backdrop-blur">
            Preview build
          </span>
          <span className="absolute right-4 top-4 -translate-x-3 rounded-sm bg-canvas/70 px-2 py-1 text-[11px] font-medium uppercase tracking-wide text-accent backdrop-blur">
            {sequence.length} moves locked
          </span>
        </div>

        {/* Right: status + progress. */}
        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Building your shot
            </p>
            <p className="text-[11px] uppercase tracking-wide text-ink-faint">
              Step {currentStage + 1} of {STAGES.length}
            </p>
          </div>

          <h2
            aria-live="polite"
            className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            {STAGES[currentStage].title}
          </h2>
          <p className="mt-3 text-sm text-ink-muted">{STAGES[currentStage].note}</p>

          {/* Queued moves, mirroring the sequence chip language. */}
          <div className="mt-6 grid grid-cols-3 gap-2.5">
            {sequence.map((item, i) => {
              const move = getMove(item.moveId);
              if (!move) return null;
              return (
                <div
                  key={item.uid}
                  className="flex flex-col items-center gap-1.5 rounded-md border border-line bg-surface-2 px-2 py-3 text-center"
                >
                  <span className="self-start font-mono text-[10px] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <MoveGlyph moveId={move.id} className="h-7 w-7 text-ink-muted" />
                  <span className="text-xs font-medium text-ink">{move.name}</span>
                </div>
              );
            })}
          </div>

          {/* Progress. */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                Generating
              </span>
              <span className="font-mono text-xs text-accent tabular-nums">{rounded}%</span>
            </div>
            <div
              className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-3"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={rounded}
              aria-label="Rendering progress"
            >
              <motion.div
                className="h-full rounded-full bg-accent"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: TICK_MS / 1000 }}
              />
            </div>
          </div>

          {/* Stage checklist. */}
          <ol className="mt-5 space-y-3">
            {STAGES.map((stage, i) => {
              const done = i < currentStage;
              const active = i === currentStage;
              return (
                <li key={stage.title} className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px]",
                      done
                        ? "border-accent bg-accent text-accent-ink"
                        : active
                          ? "border-accent text-accent"
                          : "border-line text-ink-faint",
                    )}
                  >
                    {done ? <CheckIcon size={12} weight="bold" aria-hidden /> : i + 1}
                  </span>
                  <span className={cn(active ? "text-ink" : done ? "text-ink-muted" : "text-ink-faint")}>
                    {stage.title.replace(/\.\.\.$/, "")}
                  </span>
                  {done && <span className="sr-only">completed</span>}
                  {active && <span className="sr-only">in progress</span>}
                </li>
              );
            })}
          </ol>

          <button
            type="button"
            onClick={onCancel}
            className="mt-8 self-start rounded-md border border-line px-4 py-2 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Corner({ className }: { className?: string }) {
  return <span aria-hidden className={cn("absolute h-5 w-5 border-ink-muted/70", className)} />;
}
