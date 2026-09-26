/**
 * A labelled Compose section rendered as a bento panel: a step index + title +
 * optional right-aligned hint, on a graphite surface with a fine border and
 * generous padding. Matches the containerised look of the Generating/Result
 * screens so every state shares the same card language.
 */
export function Section({
  index,
  title,
  hint,
  children,
}: {
  index?: string;
  title?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line bg-surface/50 p-5 sm:p-6">
      {(index || title || hint) && (
        <div className="mb-4 flex items-baseline gap-2">
          {index && <span className="font-mono text-xs text-accent">{index}</span>}
          {title && (
            <h2 className="text-sm font-semibold tracking-tight text-ink">{title}</h2>
          )}
          {hint && (
            <span className="ml-auto font-mono text-xs text-ink-faint tabular-nums">
              {hint}
            </span>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
