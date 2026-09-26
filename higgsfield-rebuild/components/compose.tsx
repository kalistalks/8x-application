"use client";

import type { MoveSpeed, SequenceItem } from "@/lib/types";
import { MAX_MOVES } from "@/lib/types";
import { getMoveName } from "@/lib/moves";
import { Section } from "@/components/section";
import { ImageUpload } from "@/components/image-upload";
import { SubjectPrompt } from "@/components/subject-prompt";
import { MoveLibrary } from "@/components/move-library";

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
 * The Compose screen (spec: First screen). Hosts the numbered sections:
 * 1) image upload, 2) subject prompt, 3) sequence, 4) move library, 5) generate.
 * Sections are added checkpoint by checkpoint; only what's built is rendered.
 */
export function Compose({
  prompt,
  onPromptChange,
  imageDataUrl,
  onImageChange,
  sequence,
  full,
  onAddMove,
}: Props) {
  return (
    <div className="space-y-10">
      <Section index="1" title="Reference image" hint="optional">
        <ImageUpload value={imageDataUrl} onChange={onImageChange} />
      </Section>

      <Section index="2" title="Subject prompt" hint="optional">
        <SubjectPrompt value={prompt} onChange={onPromptChange} />
      </Section>

      {/* Section 3 (the sequence chips) lands in Step 5. Temporary readout so
          card clicks are verifiable at this checkpoint. */}
      <Section index="3" title="Sequence" hint={`${sequence.length}/${MAX_MOVES}`}>
        <p className="text-sm text-ink-muted">
          {sequence.length === 0
            ? "Select moves below to choreograph camera timeline."
            : `Queued: ${sequence.map((s) => getMoveName(s.moveId)).join(" → ")}`}
        </p>
      </Section>

      <Section
        index="4"
        title="Move library"
        hint={full ? "sequence full — remove a move to add more" : undefined}
      >
        <MoveLibrary onAddMove={onAddMove} full={full} />
      </Section>
    </div>
  );
}
