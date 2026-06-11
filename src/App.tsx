import { useState } from "react";
import { CommitForm } from "./components/CommitForm";
import "./App.css";

function App() {
  const [repoInput, setRepoInput] = useState("");
  const [commitInput, setCommitInput] = useState("");

  function handleAnalyzeCommit() {
    return;
  }

  return (
    <main className="app-shell">
      <section className="hero-panel" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Public GitHub commit analysis</p>
          <h1 id="page-title">GitHub Commit Comparer</h1>
          <p className="lede">
            Enter a repository and commit, then review the parent comparison,
            changed files, categories, and readable diff previews.
          </p>
        </div>
      </section>

      <section className="tool-panel" aria-labelledby="form-title">
        <div className="section-heading">
          <h2 id="form-title">Analyze a Commit</h2>
          <p>Input parsing and GitHub API fetching will be added next.</p>
        </div>

        <CommitForm
          repoInput={repoInput}
          commitInput={commitInput}
          isLoading={false}
          onRepoInputChange={setRepoInput}
          onCommitInputChange={setCommitInput}
          onSubmit={handleAnalyzeCommit}
        />
      </section>

      <section className="results-grid" aria-label="Result preview sections">
        <article>
          <h2>Commit Overview</h2>
          <p>Metadata, parent SHA, file totals, additions, and deletions.</p>
        </article>

        <article>
          <h2>Change Categories</h2>
          <p>UI, logic, config, dependencies, tests, docs, assets, and tooling.</p>
        </article>

        <article>
          <h2>Changed Files</h2>
          <p>Expandable file cards with status, counts, and diff previews.</p>
        </article>
      </section>
    </main>
  );
}

export default App;
