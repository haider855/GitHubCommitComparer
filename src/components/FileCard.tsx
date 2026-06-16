import { useState } from "react";
import type { CommitFile } from "../types/app";
import { CAT_BADGE_BG, CAT_COLORS } from "../utils/categories";
import { DiffView } from "./DiffView";

interface FileCardProps {
  file: CommitFile;
  defaultOpen?: boolean;
}

export function FileCard({ file, defaultOpen }: FileCardProps) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const color = CAT_COLORS[file.cat];

  return (
    <article
      className={open ? "file-card open" : "file-card"}
      style={{ borderLeftColor: color }}
    >
      <button
        className="file-header"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span
          className="category-badge"
          style={{ background: CAT_BADGE_BG[file.cat], color }}
        >
          {file.cat}
        </span>
        <span className="file-path" title={file.path}>
          {file.path}
        </span>
        <span className="file-additions">+{file.additions}</span>
        <span className="file-deletions">-{file.deletions}</span>
        <i className="ti ti-chevron-down expand-icon" aria-hidden="true" />
      </button>
      {open ? <DiffView diff={file.diff} truncated={file.truncated} /> : null}
    </article>
  );
}
