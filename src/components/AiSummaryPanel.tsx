import type { AiSummaryStatus } from "../types/app";

interface AiSummaryPanelProps {
  apiKey: string;
  status: AiSummaryStatus;
  summary: string;
  error: string | null;
  onApiKeyChange: (value: string) => void;
  onGenerate: () => void | Promise<void>;
}

export function AiSummaryPanel({
  apiKey,
  status,
  summary,
  error,
  onApiKeyChange,
  onGenerate,
}: AiSummaryPanelProps) {
  const loading = status === "loading";
  const summaryParagraphs = summary
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section className="ai-panel" aria-labelledby="ai-summary-title">
      <div className="ai-panel-header">
        <div>
          <p className="section-kicker">AI summary</p>
          <h2 id="ai-summary-title">Optional commit explanation</h2>
        </div>
        <span className="ai-model-pill">GPT-5.5</span>
      </div>

      <div className="ai-controls">
        <div className="field ai-key-field">
          <label htmlFor="openai-api-key">OpenAI API key</label>
          <input
            id="openai-api-key"
            type="password"
            autoComplete="off"
            placeholder="sk-..."
            value={apiKey}
            disabled={loading}
            onChange={(event) => onApiKeyChange(event.target.value)}
          />
        </div>
        <button
          className="ai-generate-button"
          type="button"
          disabled={loading}
          onClick={() => void onGenerate()}
        >
          <i
            className={`ti ${loading ? "ti-loader-2" : "ti-sparkles"}`}
            aria-hidden="true"
          />
          {loading ? "Generating" : "Generate AI summary"}
        </button>
      </div>

      <p className="ai-note">
        Key stays in this browser session and is not saved.
      </p>

      {error ? (
        <div className="ai-inline-error">
          <i className="ti ti-alert-circle" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      {summaryParagraphs.length > 0 ? (
        <div className="ai-summary-output">
          {summaryParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
