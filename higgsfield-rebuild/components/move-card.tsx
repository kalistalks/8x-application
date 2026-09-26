"use client";

import { useRef, useState } from "react";
import { Plus, Check } from "@phosphor-icons/react";
import type { CameraMove } from "@/lib/types";
import { MoveGlyph } from "@/components/move-glyph";
import { cn } from "@/lib/utils";

type Props = {
  move: CameraMove;
  /** Append this move to the sequence. */
  onAdd: (moveId: string) => void;
  /** When the sequence is full, cards dim and stop adding (spec section 3). */
  disabled?: boolean;
};

/**
 * A single move-library card (spec: Compose section 4). Shows a looping preview
 * clip on hover/focus over a static poster, a line glyph, the name, and a short
 * description. Clicking appends the move to the sequence. Shares the graphite
 * card language with the sequence chips so "click card -> chip appears" reads
 * without explanation.
 */
export function MoveCard({ move, onAdd, disabled = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [added, setAdded] = useState(false);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play().catch(() => {
      /* autoplay/hover play can reject; poster stays, which is fine */
    });
  };

  const stop = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  const handleClick = () => {
    if (disabled) return;
    onAdd(move.id);
    // Brief "+" -> checkmark confirmation (spec: Motion and feedback).
    setAdded(true);
    window.setTimeout(() => setAdded(false), 700);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
      disabled={disabled}
      aria-label={`Add ${move.name} to sequence — ${move.description}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md border border-line bg-surface-2 text-left transition-all",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:border-line-strong hover:bg-surface-3",
      )}
    >
      {/* Preview: poster by default, clip loops on hover/focus. */}
      <div className="relative aspect-video w-full overflow-hidden bg-surface">
        <video
          ref={videoRef}
          src={move.clip}
          poster={move.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
          className="h-full w-full object-cover"
        />
        {/* Line glyph badge, top-left. */}
        <span className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-sm border border-line bg-canvas/70 text-ink-muted backdrop-blur">
          <MoveGlyph moveId={move.id} className="h-5 w-5" />
        </span>
        {/* Add affordance, top-right: + normally, check briefly after adding. */}
        <span
          className={cn(
            "absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border transition-colors",
            added
              ? "border-accent bg-accent text-accent-ink"
              : "border-line bg-canvas/70 text-ink-muted backdrop-blur group-hover:border-line-strong group-hover:text-ink",
          )}
        >
          {added ? <Check size={15} weight="bold" aria-hidden /> : <Plus size={15} weight="bold" aria-hidden />}
        </span>
      </div>

      {/* Name + description. */}
      <div className="flex flex-col gap-0.5 px-3 py-2.5">
        <span className="text-sm font-medium text-ink">{move.name}</span>
        <span className="text-xs text-ink-faint">{move.description}</span>
      </div>
    </button>
  );
}
