"use client";

import type { MoveSpeed, SequenceItem } from "@/lib/types";
import { MAX_MOVES } from "@/lib/types";
import { Section } from "@/components/section";
import { SceneComposer } from "@/components/scene-composer";
import { Sequence } from "@/components/sequence";
import { MoveLibrary } from "@/components/move-library";
import { GenerateBar } from "@/components/generate-bar";

type Props = {
  prompt: string;
  onPromptChange: (value: string) => void;
  imageDataUrl: string | null;
  onImageChange: (dataUrl: string | null) => void;
  sequence: SequenceItem[];
  full: boolean;
  onAddMove: (moveId: string) => void;
  onRemoveItem: (uid: string) => void;
  onMoveItem: (uid: string, direction: -1 | 1) => void;
  onSetItemSpeed: (uid: string, speed: MoveSpeed) => void;
  onGenerate: () => void;
};

/**
 * The Compose screen (spec: First screen). Numbered sections:
 * 1) scene inputs (prompt + attached reference image), 2) sequence,
 * 3) move library, 4) generate.
 */
export function Compose({
  prompt,
  onPromptChange,
  imageDataUrl,
  onImageChange,
  sequence,
  full,
  onAddMove,
  onRemoveItem,
  onMoveItem,
  onSetItemSpeed,
  onGenerate,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Hero header. Explicit margins (not space-y) so line rhythm is reliable. */}
      <header className="pb-2 pt-4 text-center">
        <p className="text-xs font-extrabold uppercase tracking-widest text-accent">
          Camera Choreography
        </p>
        <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-ink">
          Camera Sequence
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          Build up to three moves in the order they should happen.
        </p>
      </header>

      {/* All compose steps live in one bordered block, separated by divider
          lines — no gaps between sections. */}
      <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface/50">
        <Section index="01" title="Describe your scene" hint="REQUIRED">
          <SceneComposer
            prompt={prompt}
            onPromptChange={onPromptChange}
            imageDataUrl={imageDataUrl}
            onImageChange={onImageChange}
          />
        </Section>

        <Section index="02" title="Your Sequence" hint={`${sequence.length}/${MAX_MOVES}`}>
          <Sequence
            sequence={sequence}
            onRemoveItem={onRemoveItem}
            onMoveItem={onMoveItem}
            onSetItemSpeed={onSetItemSpeed}
          />
        </Section>

        <Section index="03" title="Move Library" hint={full ? "sequence full" : undefined}>
          <MoveLibrary onAddMove={onAddMove} full={full} />
        </Section>
      

        <GenerateBar prompt={prompt} sequence={sequence} onGenerate={onGenerate} />
      </div>
    </div>
  );
}
