export function TopBar() {
  return (
    <div className="top-bar">
      <div className="logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M12 0C5.37 0 0 5.5 0 12.28c0 5.42 3.44 10.02 8.2 11.64.6.12.82-.26.82-.6v-2.1c-3.34.74-4.04-1.65-4.04-1.65-.55-1.42-1.34-1.8-1.34-1.8-1.09-.76.08-.74.08-.74 1.2.09 1.84 1.27 1.84 1.27 1.07 1.87 2.82 1.33 3.5 1.02.11-.8.42-1.33.76-1.64-2.66-.31-5.46-1.36-5.46-6.06 0-1.34.47-2.44 1.24-3.3-.12-.31-.54-1.56.12-3.25 0 0 1.01-.33 3.3 1.26A11.3 11.3 0 0 1 12 5.92c1.02 0 2.05.14 3.01.41 2.29-1.59 3.3-1.26 3.3-1.26.66 1.69.24 2.94.12 3.25.77.86 1.24 1.96 1.24 3.3 0 4.72-2.8 5.75-5.48 6.05.43.38.82 1.13.82 2.28v3.37c0 .33.21.72.83.6A12.2 12.2 0 0 0 24 12.28C24 5.5 18.63 0 12 0Z" />
        </svg>
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
