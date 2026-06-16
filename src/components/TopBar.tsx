export function TopBar() {
  return (
    <div className="top-bar">
      <div className="logo">
        <i className="ti ti-git-commit" aria-hidden="true" />
      </div>
      <div className="brand">
        <div className="brand-name">CommitLens</div>
        <div className="brand-sub">commit analysis tool</div>
      </div>
      <div className="top-spacer" />
      <a
        className="gh-link"
        href="https://github.com"
        target="_blank"
        rel="noreferrer"
      >
        <i className="ti ti-brand-github" aria-hidden="true" /> GitHub
      </a>
    </div>
  );
}
