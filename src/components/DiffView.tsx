import type { DiffLine } from "../types/app";

interface DiffViewProps {
  diff: DiffLine[] | null;
  truncated: boolean;
}

export function DiffView({ diff, truncated }: DiffViewProps) {
  if (diff === null) {
    return (
      <div className="diff-view no-diff">
        <i className="ti ti-eye-off" aria-hidden="true" />
        No diff available for this file.
      </div>
    );
  }

  return (
    <div className="diff-view">
      <div className="diff-inner">
        {diff.map((line, index) => (
          <div className={`diff-row ${line.type}`} key={index}>
            <span className="line-no">{line.oldN ?? ""}</span>
            <span className="line-no">{line.newN ?? ""}</span>
            <span className="line-symbol">{line.sym}</span>
            <span className="line-text">{line.text || " "}</span>
          </div>
        ))}
      </div>
      {truncated ? (
        <div className="truncation-notice">
          <i className="ti ti-dots" aria-hidden="true" />
          diff truncated at 200 lines
        </div>
      ) : null}
    </div>
  );
}
