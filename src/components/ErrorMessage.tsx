import type { AppError } from "../types/app";

interface ErrorMessageProps {
  error: AppError;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="feedback-panel error-panel" role="alert">
      <h3>{error.title}</h3>
      <p>{error.message}</p>
    </div>
  );
}
