/** The three workspace states. Not routes — one continuous workspace. */
export type WorkspaceState = "compose" | "generating" | "result";

/** Speed treatment for a camera move, per spec section 3. */
export type MoveSpeed = "Slow" | "Dynamic" | "Whip";

export const MOVE_SPEEDS: MoveSpeed[] = ["Slow", "Dynamic", "Whip"];

/** Maximum number of moves a sequence can hold, per spec. */
export const MAX_MOVES = 3;

/** A camera move as defined in the library (static catalogue entry). */
export interface CameraMove {
  /** Stable id, e.g. "tilt-up". */
  id: string;
  /** Display name, e.g. "Tilt Up". */
  name: string;
  /** Short description shown under the library card. */
  description: string;
  /** Looping preview clip path under /public. */
  clip: string;
  /** Static poster shown when idle. */
  poster: string;
}

/** A move placed into the user's sequence (an instance of a CameraMove). */
export interface SequenceItem {
  /** Unique per-instance id so duplicates and reorders animate correctly. */
  uid: string;
  /** The library move this instance references. */
  moveId: string;
  /** Per-instance speed treatment. */
  speed: MoveSpeed;
}
