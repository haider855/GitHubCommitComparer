interface InputPanelProps {
  repo: string;
  sha: string;
  onRepoChange: (value: string) => void;
  onShaChange: (value: string) => void;
  onSubmit: () => void | Promise<void>;
  loading: boolean;
}

export function InputPanel({
  repo,
  sha,
  onRepoChange,
  onShaChange,
  onSubmit,
  loading,
}: InputPanelProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      void onSubmit();
    }
  }

  return (
    <div className="input-panel">
      <div className="input-row">
        <div className="field">
          <label htmlFor="repo-input">Repository</label>
          <input
            id="repo-input"
            type="text"
            autoComplete="off"
            placeholder="owner/repo or full GitHub URL"
            value={repo}
            disabled={loading}
            onChange={(event) => onRepoChange(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="field">
          <label htmlFor="sha-input">Commit SHA or URL</label>
          <input
            id="sha-input"
            type="text"
            autoComplete="off"
            placeholder="SHA or full commit URL"
            value={sha}
            disabled={loading}
            onChange={(event) => onShaChange(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <div className="input-actions">
        <button type="button" disabled={loading} onClick={() => void onSubmit()}>
          <i className="ti ti-search" aria-hidden="true" />
          Analyze commit
        </button>
        <span>press Enter to analyze</span>
      </div>
    </div>
  );
}
import type { KeyboardEvent } from "react";
