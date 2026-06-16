import { useState } from "react";
import { Banner } from "./components/Banner";
import { CategorySummaryGrid } from "./components/CategorySummaryGrid";
import { CommitOverview } from "./components/CommitOverview";
import { EmptyState } from "./components/EmptyState";
import { FileList } from "./components/FileList";
import { FilterBar } from "./components/FilterBar";
import { InputPanel } from "./components/InputPanel";
import { LoadingState } from "./components/LoadingState";
import { TopBar } from "./components/TopBar";
import {
  compareCommits,
  getCommit,
  GitHubApiError,
} from "./services/githubApi";
import type { AppState, BannerState, CommitResult } from "./types/app";
import { buildCommitResult } from "./utils/buildCommitResult";
import { classifyFile } from "./utils/classifyFile";
import { parseGitHubInput } from "./utils/parseGitHubInput";
import "./App.css";

function App() {
  const [repo, setRepo] = useState("");
  const [sha, setSha] = useState("");
  const [appState, setAppState] = useState<AppState>("idle");
  const [result, setResult] = useState<CommitResult | null>(null);
  const [banner, setBanner] = useState<BannerState | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  async function handleSubmit() {
    if (!repo.trim()) {
      setBanner({
        variant: "error",
        message:
          "Repository is required. Enter owner/repo or a full GitHub URL.",
      });
      setAppState("error");
      return;
    }

    if (!sha.trim()) {
      setBanner({
        variant: "error",
        message: "Commit SHA or URL is required.",
      });
      setAppState("error");
      return;
    }

    const parsedInput = parseGitHubInput(repo, sha);

    if (!parsedInput.ok) {
      setBanner({
        variant: "error",
        message: parsedInput.error.message,
      });
      setAppState("error");
      return;
    }

    setAppState("loading");
    setBanner(null);

    try {
      const commitData = await getCommit(
        parsedInput.value.owner,
        parsedInput.value.repo,
        parsedInput.value.commitSha,
      );
      const parents = commitData.parents ?? [];

      if (parents.length === 0) {
        setBanner({
          variant: "warn",
          message: "Root commits have no parent to compare against.",
        });
        setAppState("error");
        return;
      }

      if (parents.length > 1) {
        setBanner({
          variant: "warn",
          message: "Merge commits are not supported. Select a regular commit.",
        });
        setAppState("error");
        return;
      }

      const parentSha = parents[0].sha;
      const compareData = await compareCommits(
        parsedInput.value.owner,
        parsedInput.value.repo,
        parentSha,
        commitData.sha,
      );
      const changedFiles = compareData.files ?? [];

      if (changedFiles.length === 0) {
        setBanner({
          variant: "info",
          message: "No changed files were returned for this commit.",
        });
        setAppState("error");
        return;
      }

      const classifiedFiles = changedFiles.map((file) => ({
        ...file,
        category: classifyFile(file.filename),
      }));

      setResult(
        buildCommitResult({
          commitData,
          classifiedFiles,
          parentSha,
        }),
      );
      setActiveFilter("all");
      setAppState("success");
    } catch (error) {
      setBanner(mapErrorToBanner(error));
      setAppState("error");
    }
  }

  const showResults =
    result !== null && (appState === "success" || appState === "error");

  return (
    <div className="shell">
      <TopBar />
      <InputPanel
        repo={repo}
        sha={sha}
        onRepoChange={setRepo}
        onShaChange={setSha}
        onSubmit={handleSubmit}
        loading={appState === "loading"}
      />

      {banner ? (
        <Banner variant={banner.variant} message={banner.message} visible />
      ) : null}

      {appState === "loading" ? <LoadingState /> : null}
      {appState === "idle" ? <EmptyState /> : null}

      {showResults && result ? (
        <div className="results">
          <div className="divider" />
          <CommitOverview data={result} />
          <CategorySummaryGrid
            files={result.files}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <div className="divider" />
          <FilterBar
            files={result.files}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <FileList files={result.files} activeFilter={activeFilter} />
        </div>
      ) : null}
    </div>
  );
}

function mapErrorToBanner(error: unknown): BannerState {
  if (error instanceof GitHubApiError) {
    return {
      variant: "error",
      message: error.userMessage,
    };
  }

  return {
    variant: "error",
    message: "Something went wrong while fetching this commit.",
  };
}

export default App;
