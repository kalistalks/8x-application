/**
 * A labelled Compose section: a step index + title + optional right-aligned
 * hint, then its content. Rendered as a padded block; the parent draws a single
 * surrounding container and separates sections with divider lines.
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
    <section className="p-5 sm:p-6">
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
