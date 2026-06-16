export function LoadingState() {
  return (
    <div className="loading-state" aria-live="polite">
      <div className="spinner" />
      <div className="loading-label">fetching commit data...</div>
    </div>
  );
}
