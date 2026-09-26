"use client";

import type { SequenceItem } from "@/lib/types";
import { Section } from "@/components/section";
import { ImageUpload } from "@/components/image-upload";
import { SubjectPrompt } from "@/components/subject-prompt";

type Props = {
  prompt: string;
  onPromptChange: (value: string) => void;
  imageDataUrl: string | null;
  onImageChange: (dataUrl: string | null) => void;
  sequence: SequenceItem[];
  onSequenceChange: (next: SequenceItem[]) => void;
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
}: Props) {
  return (
    <div className="space-y-10">
      <Section index="1" title="Reference image" hint="optional">
        <ImageUpload value={imageDataUrl} onChange={onImageChange} />
      </Section>

      <Section index="2" title="Subject prompt" hint="optional">
        <SubjectPrompt value={prompt} onChange={onPromptChange} />
      </Section>
    </div>
  );
}
