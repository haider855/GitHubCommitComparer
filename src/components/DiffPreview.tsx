interface DiffPreviewProps {
  patch?: string;
}

export function DiffPreview({ patch }: DiffPreviewProps) {
  if (!patch) {
    return (
      <p className="diff-empty">
        No text diff preview is available for this file.
      </p>
    );
  }

  return <pre className="diff-preview">{patch}</pre>;
}
