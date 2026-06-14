import { useState } from "react";
import type { ClassifiedChangedFile } from "../types/app";
import { DiffPreview } from "./DiffPreview";

interface ChangedFileCardProps {
  file: ClassifiedChangedFile;
}

export function ChangedFileCard({ file }: ChangedFileCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const buttonLabel = isExpanded ? "Hide diff" : "Show diff";

  return (
    <article className="changed-file-card">
      <div className="changed-file-header">
        <div className="changed-file-title">
          <h3>{file.filename}</h3>
          {file.previous_filename ? (
            <p className="previous-filename">Renamed from {file.previous_filename}</p>
          ) : null}
          <p className="changed-file-badges">
            <span>{file.status}</span>
            <span>{file.category}</span>
          </p>
        </div>

        <button
          aria-expanded={isExpanded}
          className="diff-toggle"
          type="button"
          onClick={() => setIsExpanded((currentValue) => !currentValue)}
        >
          {buttonLabel}
        </button>
      </div>

      <dl className="changed-file-stats">
        <div>
          <dt>Additions</dt>
          <dd className="additions-count">+{file.additions}</dd>
        </div>
        <div>
          <dt>Deletions</dt>
          <dd className="deletions-count">-{file.deletions}</dd>
        </div>
        <div>
          <dt>Total changes</dt>
          <dd>{file.changes}</dd>
        </div>
      </dl>

      {isExpanded ? <DiffPreview patch={file.patch} /> : null}
    </article>
  );
}
