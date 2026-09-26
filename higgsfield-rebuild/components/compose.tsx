"use client";

import type { SequenceItem } from "@/lib/types";
import { Section } from "@/components/section";
import { ImageUpload } from "@/components/image-upload";

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
export function Compose({ imageDataUrl, onImageChange }: Props) {
  return (
    <div className="space-y-10">
      <Section index="1" title="Reference image" hint="optional">
        <ImageUpload value={imageDataUrl} onChange={onImageChange} />
      </Section>
    </div>
  );
}
