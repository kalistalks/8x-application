/**
 * A labelled Compose section: a small step index + title + optional hint, with
 * consistent spacing. Used across the Compose screen's numbered sections.
 */
export function Section({
  index,
  title,
  hint,
  children,
}: {
  index: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-xs text-ink-faint">{index}</span>
        <h2 className="text-sm font-semibold tracking-tight text-ink">{title}</h2>
        {hint && <span className="text-xs text-ink-faint">{hint}</span>}
      </div>
      {children}
    </section>
  );
}
