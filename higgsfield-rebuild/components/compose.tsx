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
    <div className="space-y-10">
      <section className="page-intro">
            <div className="eyebrow">CAMERA CHOREOGRAPHY</div>
            <h1>Camera sequence</h1>
            <p>Build up to three moves in the order they should happen.</p>
      </section>

      <Section index="01" title="Describe your scene" hint="REQUIRED">
        <SceneComposer
          prompt={prompt}
          onPromptChange={onPromptChange}
          imageDataUrl={imageDataUrl}
          onImageChange={onImageChange}
        />
      </Section>

      <Section index="02" title="Sequence" hint={`${sequence.length}/${MAX_MOVES}`}>
        <Sequence
          sequence={sequence}
          onRemoveItem={onRemoveItem}
          onMoveItem={onMoveItem}
          onSetItemSpeed={onSetItemSpeed}
        />
      </Section>

      <Section index="03" title="Move library" hint={full ? "sequence full" : undefined}>
        <MoveLibrary onAddMove={onAddMove} full={full} />
      </Section>
        <GenerateBar prompt={prompt} sequence={sequence} onGenerate={onGenerate} />
    </div>
  );
}
