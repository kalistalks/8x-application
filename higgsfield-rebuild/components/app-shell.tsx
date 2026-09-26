import { cn } from "@/lib/utils";

/**
 * The Higgsfield product shell (spec: Header). Compact brand + context only.
 * Deliberately no navigation, user controls, credits, or billing.
 * Stays consistent across all three workspace states.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Header />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-3 px-4 sm:px-6">
        <BrandMark />
        <span className="text-sm font-semibold tracking-tight text-ink">
          Higgsfield
        </span>
        <span aria-hidden className="h-4 w-px bg-line-strong" />
        <span className="text-sm text-ink-muted">Camera Sequencer</span>
        <span className="ml-auto rounded-full border border-line px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
          Cinema Studio
        </span>
      </div>
    </header>
  );
}

function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid h-6 w-6 place-items-center rounded-[7px] bg-accent text-accent-ink",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 5 v14 M18 5 v14 M6 12 h12" />
      </svg>
    </span>
  );
}
