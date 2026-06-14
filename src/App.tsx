import { useMemo, useState } from "react";
import { ChangedFileList } from "./components/ChangedFileList";
import { CommitForm } from "./components/CommitForm";
import { CommitOverview } from "./components/CommitOverview";
import { ErrorMessage } from "./components/ErrorMessage";
import { FileCategorySummary } from "./components/FileCategorySummary";
import { LoadingState } from "./components/LoadingState";
import { RuleBasedSummary } from "./components/RuleBasedSummary";
import {
  compareCommits,
  getCommit,
  GitHubApiError,
} from "./services/githubApi";
import type {
  AppError,
  ClassifiedChangedFile,
  ParsedGitHubInput,
} from "./types/app";
import type {
  GitHubCommitResponse,
  GitHubCompareResponse,
} from "./types/github";
import { classifyFile } from "./utils/classifyFile";
import { countFileCategories } from "./utils/countFileCategories";
import { parseGitHubInput } from "./utils/parseGitHubInput";
import { summarizeCommit } from "./utils/summarizeCommit";
import "./App.css";

interface AnalysisResult {
  parsedInput: ParsedGitHubInput;
  commitData: GitHubCommitResponse;
  compareData: GitHubCompareResponse;
  classifiedFiles: ClassifiedChangedFile[];
  parentSha: string;
}

function App() {
  const [repoInput, setRepoInput] = useState("");
  const [commitInput, setCommitInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const categoryCounts = useMemo(
    () =>
      analysisResult
        ? countFileCategories(analysisResult.classifiedFiles)
        : null,
    [analysisResult],
  );
  const summaryText = useMemo(() => {
    if (!analysisResult || !categoryCounts) {
      return null;
    }

    return summarizeCommit({
      commitMessage: analysisResult.commitData.commit.message,
      files: analysisResult.classifiedFiles,
      categoryCounts,
    });
  }, [analysisResult, categoryCounts]);

  async function handleAnalyzeCommit() {
    const result = parseGitHubInput(repoInput, commitInput);

    if (!result.ok) {
      setError(result.error);
      setAnalysisResult(null);
      return;
    }

    setError(null);
    setAnalysisResult(null);
    setIsLoading(true);

    try {
      const commitData = await getCommit(
        result.value.owner,
        result.value.repo,
        result.value.commitSha,
      );

      if (commitData.parents.length === 0) {
        setError({
          title: "Root commit not supported",
          message:
            "This commit has no parent commit. There is no previous commit to compare against.",
        });
        return;
      }

      if (commitData.parents.length > 1) {
        setError({
          title: "Merge commit not supported",
          message:
            "This commit has multiple parent commits. Merge commit comparison is not supported in the MVP.",
        });
        return;
      }

      const parentSha = commitData.parents[0].sha;
      const compareData = await compareCommits(
        result.value.owner,
        result.value.repo,
        parentSha,
        commitData.sha,
      );
      const classifiedFiles = (compareData.files ?? []).map((file) => ({
        ...file,
        category: classifyFile(file.filename),
      }));

      setAnalysisResult({
        parsedInput: result.value,
        commitData,
        compareData,
        classifiedFiles,
        parentSha,
      });
    } catch (caughtError) {
      setError(toAppError(caughtError));
    } finally {
      setIsLoading(false);
    }
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
          <p>Fetch a public commit and compare it against its direct parent.</p>
        </div>

        <CommitForm
          repoInput={repoInput}
          commitInput={commitInput}
          isLoading={isLoading}
          onRepoInputChange={setRepoInput}
          onCommitInputChange={setCommitInput}
          onSubmit={handleAnalyzeCommit}
        />

        {isLoading ? (
          <LoadingState message="Fetching commit and parent comparison from GitHub." />
        ) : null}

        {error ? <ErrorMessage error={error} /> : null}

        {analysisResult ? (
          <>
            <CommitOverview
              commit={analysisResult.commitData}
              compare={analysisResult.compareData}
              parentSha={analysisResult.parentSha}
            />
            {summaryText ? <RuleBasedSummary summaryText={summaryText} /> : null}
            {categoryCounts ? (
              <FileCategorySummary categoryCounts={categoryCounts} />
            ) : null}
            <ChangedFileList files={analysisResult.classifiedFiles} />
          </>
        ) : null}
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

function toAppError(error: unknown): AppError {
  if (error instanceof GitHubApiError) {
    return {
      title: error.title,
      message: error.userMessage,
    };
  }

  return {
    title: "Unexpected error",
    message: "Something went wrong while fetching this commit.",
  };
}

export default App;
