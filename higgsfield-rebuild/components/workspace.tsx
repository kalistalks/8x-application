"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MAX_MOVES, type MoveSpeed, type SequenceItem, type WorkspaceState } from "@/lib/types";
import { Compose } from "@/components/compose";
import { Generating } from "@/components/generating";

/** Per-instance id for a sequence item (stable across reorders). */
function newUid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Default speed treatment for a freshly added move. */
const DEFAULT_SPEED: MoveSpeed = "Dynamic";

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

  const full = sequence.length >= MAX_MOVES;

  const addMove = useCallback((moveId: string) => {
    setSequence((prev) => {
      if (prev.length >= MAX_MOVES) return prev; // enforce max; duplicates allowed
      return [...prev, { uid: newUid(), moveId, speed: DEFAULT_SPEED }];
    });
  }, []);

  const removeItem = useCallback((uid: string) => {
    setSequence((prev) => prev.filter((item) => item.uid !== uid));
  }, []);

  const setItemSpeed = useCallback((uid: string, speed: MoveSpeed) => {
    setSequence((prev) => prev.map((item) => (item.uid === uid ? { ...item, speed } : item)));
  }, []);

  /** Move an item one position earlier (-1) or later (+1), clamped. */
  const moveItem = useCallback((uid: string, direction: -1 | 1) => {
    setSequence((prev) => {
      const from = prev.findIndex((item) => item.uid === uid);
      if (from === -1) return prev;
      const to = from + direction;
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  }, []);

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
              full={full}
              onAddMove={addMove}
              onRemoveItem={removeItem}
              onMoveItem={moveItem}
              onSetItemSpeed={setItemSpeed}
              onGenerate={() => setState("generating")}
            />
          )}
          {state === "generating" && (
            <Generating
              sequence={sequence}
              onCancel={() => setState("compose")}
              onComplete={() => setState("result")}
            />
          )}
          {state === "result" && (
            // Result screen lands in Step 8. Temporary panel with a working
            // Start over so the flow is complete-able during review.
            <div className="grid min-h-[320px] place-items-center rounded-lg border border-dashed border-line bg-surface/40 p-10 text-center">
              <div>
                <p className="text-lg font-semibold text-ink">Your shot is ready.</p>
                <p className="mt-1 max-w-sm text-sm text-ink-muted">
                  Result screen (video, summary, download, disclosure) lands in Step 8.
                </p>
                <button
                  type="button"
                  onClick={startOver}
                  className="mt-4 rounded-md border border-line px-4 py-2 text-sm text-ink-muted hover:border-line-strong hover:text-ink"
                >
                  Start over
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
