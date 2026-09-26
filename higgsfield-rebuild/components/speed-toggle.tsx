"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
 * Slow / Dynamic / Whip. A Framer Motion pill slides snappily behind the active
 * option so experimenting feels responsive. Implemented as a radiogroup — it's
 * keyboard accessible and the active state is shown by label, not color alone.
 */
export function SpeedToggle({ value, onChange, moveName }: Props) {
  const reduce = useReducedMotion();
  const groupId = useId();

  return (
    <div
      role="radiogroup"
      aria-label={`Speed for ${moveName}`}
      className="inline-flex w-full items-center rounded-full border border-line bg-canvas/60 p-0.5"
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
            className="relative flex-1 rounded-full px-1.5 py-1 text-[11px] font-medium transition-colors"
          >
            {active && (
              <motion.span
                layoutId={reduce ? undefined : `speed-pill-${groupId}`}
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 600, damping: 34 }}
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative z-10",
                active ? "text-accent-ink" : "text-ink-faint hover:text-ink",
              )}
            >
              {speed}
            </span>
          </button>
        );
      })}
    </div>
  );
}
