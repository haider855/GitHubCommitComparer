import { parsePatch } from "../utils/parsePatch";

interface DiffPreviewProps {
  patch?: string;
}

export function DiffPreview({ patch }: DiffPreviewProps) {
  if (!patch) {
    return (
      <p className="diff-empty">
        No text diff preview is available for this file. It may be binary,
        renamed, deleted, or too large.
      </p>
    );
  }

  const parsedPatch = parsePatch(patch);

  return (
    <div className="diff-preview">
      <pre>
        <code>
          {parsedPatch.lines.map((line, index) => (
            <span className={`diff-line diff-line-${line.type}`} key={index}>
              {line.content || " "}
            </span>
          ))}
        </code>
      </pre>

      {parsedPatch.isTruncated ? (
        <p className="diff-truncated">Diff preview truncated for readability.</p>
      ) : null}
    </div>
  );
}
