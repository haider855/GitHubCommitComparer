interface LoadingStateProps {
  message: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="feedback-panel loading-panel" aria-live="polite">
      <h3>Loading</h3>
      <p>{message}</p>
    </div>
  );
}
