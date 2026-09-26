"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  CaretDownIcon,
  X,
} from "@phosphor-icons/react";
import { MAX_MOVES, type MoveSpeed, type SequenceItem } from "@/lib/types";
import { getMove } from "@/lib/moves";
import { MoveGlyph } from "@/components/move-glyph";
import { SpeedToggle } from "@/components/speed-toggle";
import { cn } from "@/lib/utils";

type Props = {
  sequence: SequenceItem[];
  onRemoveItem: (uid: string) => void;
  onMoveItem: (uid: string, direction: -1 | 1) => void;
  onSetItemSpeed: (uid: string, speed: MoveSpeed) => void;
};

/** Two-digit position label, e.g. 1 -> "01". */
function pos(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * The sequence (spec: Compose section 3) — the core UX piece. Always renders
 * MAX_MOVES slots in a row: occupied slots are animated chips, empty slots are
 * dashed ghosts. Add/reorder/remove all animate via Framer Motion layout, and
 * respect prefers-reduced-motion.
 */
export function Sequence({ sequence, onRemoveItem, onMoveItem, onSetItemSpeed }: Props) {
  const reduce = useReducedMotion();
  const emptyCount = Math.max(0, MAX_MOVES - sequence.length);
  const emptyIndexes = Array.from({ length: emptyCount }, (_, i) => sequence.length + i);

  return (
    <div className="space-y-3">
      {/* Helper label above the row (spec: subtle helper label). */}
      <p className="text-xs text-ink-faint" aria-hidden={sequence.length > 0}>
        {sequence.length === 0
          ? "Select moves below to choreograph camera timeline."
          : `${sequence.length} of ${MAX_MOVES} moves · reorder or remove below`}
      </p>

      <ol
        className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-stretch"
        aria-label="Camera move sequence"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {sequence.map((item, index) => {
            const move = getMove(item.moveId);
            if (!move) return null;
            return (
              <motion.li
                key={item.uid}
                layout={reduce ? false : true}
                initial={reduce ? false : { opacity: 0, scale: 0.96, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 6 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <div className="flex h-full flex-col gap-3 rounded-md border border-line bg-surface-2 p-3.5">
                  {/* Top row: position · glyph · name · remove. */}
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-accent tabular-nums">
                      {pos(index + 1)}
                    </span>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-line bg-canvas/50 text-ink-muted">
                      <MoveGlyph moveId={move.id} className="h-7 w-7" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                      {move.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.uid)}
                      aria-label={`Remove ${move.name} from position ${pos(index + 1)}`}
                      title="Remove"
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-sm text-ink-faint transition-colors hover:bg-surface-3 hover:text-ink"
                    >
                      <X size={15} weight="bold" aria-hidden />
                    </button>
                  </div>

                  {/* Speed row. */}
                  <SpeedToggle
                    value={item.speed}
                    onChange={(speed) => onSetItemSpeed(item.uid, speed)}
                    moveName={move.name}
                  />

                  {/* Reorder controls, centered at the base of the chip. */}
                  <div className="mt-auto flex items-center justify-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => onMoveItem(item.uid, -1)}
                      disabled={index === 0}
                      aria-label={`Move ${move.name} earlier`}
                      title="Move earlier"
                      className={cn(
                        "grid h-7 w-9 place-items-center rounded-sm border border-line transition-colors",
                        index === 0
                          ? "cursor-not-allowed text-ink-faint/40"
                          : "text-ink-muted hover:border-line-strong hover:text-ink",
                      )}
                    >
                      {/* Chips stack vertically on mobile, in a row at sm+ —
                          so use up/down on mobile, left/right at sm+. */}
                      <CaretUpIcon size={14} weight="bold" aria-hidden className="sm:hidden" />
                      <CaretLeftIcon size={14} weight="bold" aria-hidden className="hidden sm:block" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveItem(item.uid, 1)}
                      disabled={index === sequence.length - 1}
                      aria-label={`Move ${move.name} later`}
                      title="Move later"
                      className={cn(
                        "grid h-7 w-9 place-items-center rounded-sm border border-line transition-colors",
                        index === sequence.length - 1
                          ? "cursor-not-allowed text-ink-faint/40"
                          : "text-ink-muted hover:border-line-strong hover:text-ink",
                      )}
                    >
                      <CaretDownIcon size={14} weight="bold" aria-hidden className="sm:hidden" />
                      <CaretRightIcon size={14} weight="bold" aria-hidden className="hidden sm:block" />
                    </button>
                  </div>
                </div>
              </motion.li>
            );
          })}

          {/* Ghost/empty slots — always fill to MAX_MOVES (spec). */}
          {emptyIndexes.map((slotIndex) => (
            <motion.li
              key={`empty-${slotIndex}`}
              layout={reduce ? false : true}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              aria-hidden
            >
              <div className="flex h-full min-h-[128px] flex-col items-center justify-center gap-1 rounded-md border border-dashed border-line bg-surface/30 p-3.5 text-center">
                <span className="font-mono text-xs text-ink-faint tabular-nums">
                  + {pos(slotIndex + 1)}
                </span>
                <span className="text-sm text-ink-faint">Empty</span>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </div>
  );
}
