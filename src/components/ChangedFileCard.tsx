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
          <p>
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

      {isExpanded ? <DiffPreview patch={file.patch} /> : null}
    </article>
  );
}
