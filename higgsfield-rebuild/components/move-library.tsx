"use client";

import { MOVES } from "@/lib/moves";
import { MoveCard } from "@/components/move-card";

type Props = {
  /** Append a move to the sequence by id. */
  onAddMove: (moveId: string) => void;
  /** When true, the sequence is full — dim all cards and block adding. */
  full: boolean;
};

/**
 * The move library grid (spec: Compose section 4). Responsive grid of camera-move
 * cards. When the sequence hits its max, the whole grid dims to opacity-50 and
 * cards stop adding.
 */
export function MoveLibrary({ onAddMove, full }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {MOVES.map((move) => (
        <MoveCard key={move.id} move={move} onAdd={onAddMove} disabled={full} />
      ))}
    </div>
  );
}
