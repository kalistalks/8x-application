import type { CameraMove } from "@/lib/types";

/**
 * The camera-move library (spec section 4). Names are taken from Higgsfield's
 * actual camera-move modal. Real clips live under /public/moves/videos (named
 * with underscores) and per-move posters under /public/moves/posters.
 */
export const MOVES: CameraMove[] = [
  {
    id: "tilt-up",
    name: "Tilt Up",
    description: "Reveal from low to high",
    clip: "/moves/videos/tilt_up.mp4",
    poster: "/moves/posters/tilt-up.svg",
  },
  {
    id: "pan-left",
    name: "Pan Left",
    description: "Sweep across the scene",
    clip: "/moves/videos/pan_left.mp4",
    poster: "/moves/posters/pan-left.svg",
  },
  {
    id: "orbit",
    name: "Orbit",
    description: "Circle around the subject",
    clip: "/moves/videos/orbit.mp4",
    poster: "/moves/posters/orbit.svg",
  },
  {
    id: "crane-up",
    name: "Crane Up",
    description: "Rise into a wide reveal",
    clip: "/moves/videos/crane_up.mp4",
    poster: "/moves/posters/crane-up.svg",
  },
  {
    id: "snorricam",
    name: "Snorricam",
    description: "Lock the subject, spin the world",
    clip: "/moves/videos/snorricam.mp4",
    poster: "/moves/posters/snorricam.svg",
  },
  {
    id: "pov",
    name: "POV",
    description: "See through the subject's eyes",
    clip: "/moves/videos/pov.mp4",
    poster: "/moves/posters/pov.svg",
  },
  {
    id: "rack-focus",
    name: "Rack Focus",
    description: "Shift focus between planes",
    clip: "/moves/videos/rack_focus.mp4",
    poster: "/moves/posters/rack-focus.svg",
  },
  {
    id: "robot-arm",
    name: "Robot Arm",
    description: "Programmed motion-control path",
    clip: "/moves/videos/robot_arm.mp4",
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
