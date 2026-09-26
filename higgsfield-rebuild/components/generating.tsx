"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { X, Check, CircleNotch } from "@phosphor-icons/react";
import type { SequenceItem } from "@/lib/types";
import { getMoveName } from "@/lib/moves";
import { cn } from "@/lib/utils";

/** The three render stages (spec section 6). */
const STAGES = [
  "Compiling sequence...",
  "Applying camera choreography...",
  "Rendering...",
] as const;

/** Total render time — DoD says ~6–8s. Split evenly across the three stages. */
const TOTAL_MS = 6600;
const STAGE_MS = TOTAL_MS / STAGES.length;
const TICK_MS = 60;

type Props = {
  sequence: SequenceItem[];
  onCancel: () => void;
  onComplete: () => void;
};

/**
 * The Generating state (spec: Second screen). Runs a staged status-text timer
 * with an indeterminate-feeling progress bar (0 -> 100%), shows the current step
 * with completed/active/upcoming stages, keeps the queued sequence visible, and
 * auto-advances to the Result. Cancel returns to Compose with state intact.
 */
export function Generating({ sequence, onCancel, onComplete }: Props) {
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
        // Small beat at 100% before advancing.
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
  const summary = sequence.map((s) => getMoveName(s.moveId)).join(" → ");
  const rounded = Math.round(progress);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-10 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full border border-line bg-surface text-accent">
        <CircleNotch size={22} className={reduce ? "" : "animate-spin"} aria-hidden />
      </span>

      {/* Live-updating status line (spec: aria-live). */}
      <p aria-live="polite" className="mt-5 text-base font-medium text-ink">
        {STAGES[currentStage]}
      </p>
      <p className="mt-1 text-sm text-ink-faint">
        Step {currentStage + 1} of {STAGES.length}
      </p>

      {/* Progress bar + approximate percentage. */}
      <div className="mt-6 w-full">
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3"
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
        <p className="mt-2 text-right font-mono text-xs text-ink-faint tabular-nums">
          {rounded}%
        </p>
      </div>

      {/* Stage checklist: completed / active / upcoming. */}
      <ol className="mt-6 w-full space-y-2 text-left">
        {STAGES.map((stage, i) => {
          const done = i < currentStage;
          const active = i === currentStage;
          return (
            <li
              key={stage}
              className={cn(
                "flex items-center gap-2.5 rounded-md border px-3 py-2 text-sm transition-colors",
                active
                  ? "border-line-strong bg-surface-2 text-ink"
                  : done
                    ? "border-line bg-surface/40 text-ink-muted"
                    : "border-line bg-surface/20 text-ink-faint",
              )}
            >
              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px]",
                  done
                    ? "border-accent bg-accent text-accent-ink"
                    : active
                      ? "border-accent text-accent"
                      : "border-line text-ink-faint",
                )}
              >
                {done ? <Check size={12} weight="bold" aria-hidden /> : i + 1}
              </span>
              <span>{stage}</span>
              {done && <span className="sr-only">completed</span>}
              {active && <span className="sr-only">in progress</span>}
            </li>
          );
        })}
      </ol>

      {/* Queued sequence stays visible while rendering. */}
      {summary && (
        <p className="mt-6 text-xs text-ink-faint">
          <span className="text-ink-muted">Sequence:</span> {summary}
        </p>
      )}

      <button
        type="button"
        onClick={onCancel}
        className="mt-8 inline-flex items-center gap-1.5 rounded-md border border-line px-4 py-2 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
      >
        <X size={15} weight="bold" aria-hidden />
        Cancel
      </button>
    </div>
  );
}
