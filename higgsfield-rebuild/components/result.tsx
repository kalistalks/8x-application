"use client";

import { useRef, useState } from "react";
import { ArrowClockwise, DownloadSimple, Repeat, Info } from "@phosphor-icons/react";
import type { SequenceItem } from "@/lib/types";
import { getMoveName } from "@/lib/moves";
import { cn } from "@/lib/utils";

/**
 * The single bundled mock result clip. Per SPEC.md a pre-picked stock clip is
 * fine — it does not reflect the chosen sequence. We reuse one of the move
 * clips as the mock output (flagged in the README).
 */
const RESULT_CLIP = "/moves/videos/orbit.mp4";
const RESULT_FILENAME = "higgsfield-shot.mp4";

type Props = {
  prompt: string;
  sequence: SequenceItem[];
  onStartOver: () => void;
};

/**
 * The Result state (spec: Third screen). A centered 16:9 frame with the mocked
 * video (autoplay, muted, looped) and native controls, plus a loop toggle. Shows
 * the used sequence and subject prompt, a download of the same clip, the
 * mocked-generation disclosure, and Start over.
 */
export function Result({ prompt, sequence, onStartOver }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loop, setLoop] = useState(true);

  const summary = sequence.map((s) => getMoveName(s.moveId)).join(" → ");
  const trimmedPrompt = prompt.trim();

  const toggleLoop = () => {
    setLoop((prev) => {
      const next = !prev;
      if (videoRef.current) videoRef.current.loop = next;
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-ink">
        Your shot is ready.
      </h2>

      {/* Centered 16:9 frame. */}
      <div className="mt-6 overflow-hidden rounded-lg border border-line bg-black">
        <video
          ref={videoRef}
          src={RESULT_CLIP}
          autoPlay
          muted
          loop={loop}
          playsInline
          controls
          className="aspect-video w-full"
        />
      </div>

      {/* Controls row: loop toggle + download. */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={toggleLoop}
          aria-pressed={loop}
          className={cn(
            "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
            loop
              ? "border-accent/50 bg-accent/10 text-ink"
              : "border-line text-ink-muted hover:border-line-strong hover:text-ink",
          )}
        >
          <Repeat size={16} weight="bold" aria-hidden />
          Loop {loop ? "on" : "off"}
        </button>

        <a
          href={RESULT_CLIP}
          download={RESULT_FILENAME}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
        >
          <DownloadSimple size={16} weight="bold" aria-hidden />
          Download
        </a>
      </div>

      {/* Sequence + prompt used. */}
      <dl className="mt-6 space-y-4 rounded-md border border-line bg-surface/50 p-4">
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink-faint">Sequence</dt>
          <dd className="mt-1 text-sm text-ink">
            {summary || <span className="text-ink-faint">No moves selected.</span>}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink-faint">Subject prompt</dt>
          <dd className={cn("mt-1 text-sm", trimmedPrompt ? "text-ink" : "text-ink-faint")}>
            {trimmedPrompt || "No subject description added."}
          </dd>
        </div>
      </dl>

      {/* Mocked-generation disclosure (spec: must be visible, not obscured). */}
      <p className="mt-4 flex items-start gap-2 text-xs text-ink-faint">
        <Info size={14} weight="fill" aria-hidden className="mt-0.5 shrink-0" />
        This prototype uses a bundled mock video. No generation model is connected.
      </p>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={onStartOver}
          className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
        >
          <ArrowClockwise size={16} weight="bold" aria-hidden />
          Start over
        </button>
      </div>
    </div>
  );
}
