interface EmptyStateProps {
  icon?: string;
  title?: string;
  subtitle?: string;
}

export function EmptyState({
  icon = "git-diff",
  title = "No commit loaded",
  subtitle = "Enter a GitHub repository and commit SHA above to see a structured breakdown of what changed.",
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <i className={`ti ti-${icon}`} aria-hidden="true" />
      </div>
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}
