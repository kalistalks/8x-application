"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SequenceItem, WorkspaceState } from "@/lib/types";
import { Compose } from "@/components/compose";

/**
 * The workspace state machine (spec: Product Principle). Holds all shared state
 * and crossfades between Compose / Generating / Result — these are states, not
 * routes. The shell around it stays constant.
 */
export function Workspace() {
  const [state, setState] = useState<WorkspaceState>("compose");

  // Shared creative state, preserved across Generating (Cancel restores it).
  const [prompt, setPrompt] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [sequence, setSequence] = useState<SequenceItem[]>([]);

  const startOver = useCallback(() => {
    setPrompt("");
    setImageDataUrl(null);
    setSequence([]);
    setState("compose");
  }, []);

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={state}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {state === "compose" && (
            <Compose
              prompt={prompt}
              onPromptChange={setPrompt}
              imageDataUrl={imageDataUrl}
              onImageChange={setImageDataUrl}
              sequence={sequence}
              onSequenceChange={setSequence}
              onGenerate={() => setState("generating")}
            />
          )}
          {state === "generating" && (
            <StatePlaceholder title="Generating" note="Staged status text + progress bar land here." />
          )}
          {state === "result" && (
            <StatePlaceholder title="Result" note="Mocked video, sequence summary, download, start over land here." />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Temporary scaffold controls to prove the state machine + crossfade.
          Removed once real Compose / Generate / Result wiring lands. */}
      <div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-4 text-xs text-ink-faint">
        <span className="mr-1 self-center">scaffold nav:</span>
        {(["compose", "generating", "result"] as WorkspaceState[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => (s === "compose" ? startOver() : setState(s))}
            className="rounded-sm border border-line px-2 py-1 text-ink-muted hover:border-line-strong hover:text-ink"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatePlaceholder({ title, note }: { title: string; note: string }) {
  return (
    <div className="grid min-h-[320px] place-items-center rounded-lg border border-dashed border-line bg-surface/40 p-10 text-center">
      <div>
        <p className="text-lg font-semibold text-ink">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-ink-muted">{note}</p>
      </div>
    </div>
  );
}
