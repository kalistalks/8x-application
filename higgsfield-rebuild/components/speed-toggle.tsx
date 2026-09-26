"use client";

import { MOVE_SPEEDS, type MoveSpeed } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  value: MoveSpeed;
  onChange: (speed: MoveSpeed) => void;
  /** Move name, for accessible labelling of the group. */
  moveName: string;
};

/**
 * Speed toggle pill (spec: Compose section 3). Cycles a move between
 * Slow / Dynamic / Whip. Implemented as a radiogroup so it's keyboard
 * accessible and not communicated by color alone (the active label is shown).
 */
export function SpeedToggle({ value, onChange, moveName }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label={`Speed for ${moveName}`}
      className="inline-flex items-center gap-0.5 rounded-full border border-line bg-canvas/60 p-0.5"
    >
      {MOVE_SPEEDS.map((speed) => {
        const active = speed === value;
        return (
          <button
            key={speed}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(speed)}
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors",
              active
                ? "bg-accent text-accent-ink"
                : "text-ink-faint hover:text-ink",
            )}
          >
            {speed}
          </button>
        );
      })}
    </div>
  );
}
