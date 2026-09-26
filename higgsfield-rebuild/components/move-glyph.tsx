import { cn } from "@/lib/utils";

/**
 * Line-based movement glyphs (spec section 4): a simple diagram of the camera
 * motion for each move. Purely decorative — labels/names carry the meaning, so
 * these are aria-hidden.
 */

type GlyphProps = {
  className?: string;
};

const base = "h-full w-full";

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(base, className)}
    >
      {/* subject box */}
      <rect x="17" y="17" width="14" height="14" rx="2" className="opacity-40" />
      {children}
    </svg>
  );
}

export const GLYPHS: Record<string, (p: GlyphProps) => React.ReactElement> = {
  "tilt-up": ({ className }) => (
    <Frame className={className}>
      <path d="M24 38 V14" />
      <path d="M18 20 L24 14 L30 20" />
    </Frame>
  ),
  "pan-left": ({ className }) => (
    <Frame className={className}>
      <path d="M38 24 H10" />
      <path d="M16 18 L10 24 L16 30" />
    </Frame>
  ),
  orbit: ({ className }) => (
    <Frame className={className}>
      <ellipse cx="24" cy="24" rx="18" ry="9" />
      <path d="M9 19 L6 24 L11 26" />
    </Frame>
  ),
  "crane-up": ({ className }) => (
    <Frame className={className}>
      <path d="M12 40 H36" />
      <path d="M24 40 V12" />
      <path d="M17 19 L24 12 L31 19" />
    </Frame>
  ),
  snorricam: ({ className }) => (
    <Frame className={className}>
      <circle cx="24" cy="24" r="16" />
      <path d="M24 8 V14 M24 34 V40 M8 24 H14 M34 24 H40" className="opacity-60" />
    </Frame>
  ),
  pov: ({ className }) => (
    <Frame className={className}>
      <path d="M6 24 L18 16 V32 Z" className="opacity-70" />
      <path d="M22 24 H40" />
      <path d="M34 18 L40 24 L34 30" />
    </Frame>
  ),
  "rack-focus": ({ className }) => (
    <Frame className={className}>
      <circle cx="16" cy="24" r="5" />
      <circle cx="33" cy="24" r="8" className="opacity-50" />
    </Frame>
  ),
  "robot-arm": ({ className }) => (
    <Frame className={className}>
      <path d="M10 40 L20 26 L30 30 L38 12" />
      <circle cx="20" cy="26" r="2" />
      <circle cx="30" cy="30" r="2" />
    </Frame>
  ),
};

export function MoveGlyph({ moveId, className }: { moveId: string; className?: string }) {
  const Glyph = GLYPHS[moveId];
  if (!Glyph) return null;
  return <Glyph className={className} />;
}
