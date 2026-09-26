"use client";

import { useRef, useState } from "react";
import { ArrowClockwiseIcon, RepeatIcon, DownloadSimpleIcon, CheckIcon } from "@phosphor-icons/react";
import type { SequenceItem } from "@/lib/types";
import { getMove, getMoveName } from "@/lib/moves";
import { MoveGlyph } from "@/components/move-glyph";
import { cn } from "@/lib/utils";

/**
 * The single bundled mock result clip. Per SPEC.md a pre-picked stock clip is
 * fine — it does not reflect the chosen sequence. We reuse one of the move
 * clips as the mock output (flagged in the README).
 */
const RESULT_CLIP = "/mock.mp4";
const RESULT_FILENAME = "higgsfield-shot.mp4";

type Props = {
  prompt: string;
  sequence: SequenceItem[];
  onStartOver: () => void;
};

/** Two-digit position label, e.g. 1 -> "01". */
function pos(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * The Result state (spec: Third screen). Two-column layout: the mocked video on
 * the left (autoplay, muted, looped, native controls + loop toggle) and a
 * sidebar with the used sequence, subject prompt, download, start over, and the
 * mocked-generation disclosure.
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
    <div>
      {/* Header: eyebrow + heading, with a render-complete badge. */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Shot complete</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Your shot is ready.
          </h2>
        </div>
        <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-md border border-accent/40 bg-accent/10 px-2.5 py-1.5 text-xs font-medium text-ink">
          <CheckIcon size={13} weight="bold" className="text-accent" aria-hidden />
          Render complete
        </span>
      </div>

      {/* Two columns: video + sidebar. */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Video. */}
        <div className="overflow-hidden rounded-lg border border-line bg-black">
          <video
            ref={videoRef}
            src={RESULT_CLIP}
            poster="/preview-poster.jpg"
            autoPlay
            muted
            loop={loop}
            playsInline
            controls
            className="aspect-video w-full object-cover"
          />
        </div>

        {/* Sidebar. */}
        <aside className="flex flex-col rounded-lg border border-line bg-surface/60 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Sequence used
          </h3>
          <ol className="mt-3 space-y-2">
            {sequence.map((item, index) => {
              const move = getMove(item.moveId);
              if (!move) return null;
              return (
                <li
                  key={item.uid}
                  className="flex items-center gap-3 rounded-md border border-line bg-surface-2 px-3 py-2.5"
                >
                  <span className="font-mono text-xs text-accent tabular-nums">{pos(index + 1)}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border border-line bg-canvas/50 text-ink-muted">
                    <MoveGlyph moveId={move.id} className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-medium text-ink">{move.name}</span>
                </li>
              );
            })}
          </ol>
          {/* {summary && <p className="mt-3 text-xs text-ink-faint">{summary}</p>} */}

          {/* Loop toggle for the playback. */}
          <button
            type="button"
            onClick={toggleLoop}
            aria-pressed={loop}
            className={cn(
              "mt-4 inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
              loop
                ? "border-accent/50 bg-accent/10 text-ink"
                : "border-line text-ink-muted hover:border-line-strong hover:text-ink",
            )}
          >
            <RepeatIcon size={15} weight="bold" aria-hidden />
            Loop {loop ? "on" : "off"}
          </button>

          <hr className="my-5 border-line" />

          <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Subject</h3>
          <p className={cn("mt-2 text-sm", trimmedPrompt ? "text-ink" : "text-ink-faint")}>
            {trimmedPrompt || "No subject description added."}
          </p>

          {/* Actions. */}
          <a
            href={RESULT_CLIP}
            download={RESULT_FILENAME}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
          >
            <DownloadSimpleIcon size={17} weight="bold" aria-hidden />
            Download video
          </a>
          <button
            type="button"
            onClick={onStartOver}
            className="mt-2.5 inline-flex items-center justify-center gap-2 rounded-md border border-line px-4 py-2.5 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            <ArrowClockwiseIcon size={15} weight="bold" aria-hidden />
            Start over
          </button>

          {/* Mocked-generation disclosure (spec: must be visible). */}
          <p className="mt-4 text-center text-xs leading-relaxed text-ink-faint">
            This prototype uses a bundled mock video. No generation model is connected.
          </p>
        </aside>
      </div>
    </div>
  );
}
