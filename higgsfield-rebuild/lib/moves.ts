import type { CameraMove } from "@/lib/types";

/**
 * The camera-move library (spec section 4). Names are taken from Higgsfield's
 * actual camera-move modal. Clips live under /public/moves and posters under
 * /public/moves/posters. Per the spec, a clip may be reused across visually
 * similar moves — it does not need to be 8 unique assets.
 *
 * NOTE: until real clips are dropped into /public/moves, these paths point at
 * placeholder assets (see the flag raised to the user).
 */
export const MOVES: CameraMove[] = [
  {
    id: "tilt-up",
    name: "Tilt Up",
    description: "Reveal from low to high",
    clip: "/moves/tilt-up.mp4",
    poster: "/moves/posters/tilt-up.svg",
  },
  {
    id: "pan-left",
    name: "Pan Left",
    description: "Sweep across the scene",
    clip: "/moves/pan-left.mp4",
    poster: "/moves/posters/pan-left.svg",
  },
  {
    id: "orbit",
    name: "Orbit",
    description: "Circle around the subject",
    clip: "/moves/orbit.mp4",
    poster: "/moves/posters/orbit.svg",
  },
  {
    id: "crane-up",
    name: "Crane Up",
    description: "Rise into a wide reveal",
    clip: "/moves/crane-up.mp4",
    poster: "/moves/posters/crane-up.svg",
  },
  {
    id: "snorricam",
    name: "Snorricam",
    description: "Lock the subject, spin the world",
    clip: "/moves/snorricam.mp4",
    poster: "/moves/posters/snorricam.svg",
  },
  {
    id: "pov",
    name: "POV",
    description: "See through the subject's eyes",
    clip: "/moves/pov.mp4",
    poster: "/moves/posters/pov.svg",
  },
  {
    id: "rack-focus",
    name: "Rack Focus",
    description: "Shift focus between planes",
    clip: "/moves/rack-focus.mp4",
    poster: "/moves/posters/rack-focus.svg",
  },
  {
    id: "robot-arm",
    name: "Robot Arm",
    description: "Programmed motion-control path",
    clip: "/moves/robot-arm.mp4",
    poster: "/moves/posters/robot-arm.svg",
  },
];

const MOVES_BY_ID = new Map(MOVES.map((m) => [m.id, m]));

export function getMove(id: string): CameraMove | undefined {
  return MOVES_BY_ID.get(id);
}

export function getMoveName(id: string): string {
  return MOVES_BY_ID.get(id)?.name ?? id;
}
