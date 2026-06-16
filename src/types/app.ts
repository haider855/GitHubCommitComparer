import type { GitHubCompareFile } from "./github";

export const FILE_CATEGORIES = [
  "Logic",
  "UI",
  "Config",
  "Tests",
  "Documentation",
  "Dependencies",
  "Build/Tooling",
  "Assets",
  "Other",
] as const;

export type FileCategory = (typeof FILE_CATEGORIES)[number];

export type CategoryFilter = FileCategory | "All";

export type CategoryCounts = Record<FileCategory, number>;

export interface ParsedGitHubInput {
  owner: string;
  repo: string;
  commitSha: string;
}

export interface AppError {
  title: string;
  message: string;
}

export interface ClassifiedChangedFile extends GitHubCompareFile {
  category: FileCategory;
}

export type AppState = "idle" | "loading" | "error" | "success";

export type BannerVariant = "error" | "warn" | "info";

export interface BannerState {
  variant: BannerVariant;
  message: string;
}

export interface CommitResult {
  message: string;
  author: string;
  date: string;
  sha: string;
  parentSha: string;
  url: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  files: CommitFile[];
}

export interface CommitFile {
  path: string;
  cat: FileCategory;
  additions: number;
  deletions: number;
  diff: DiffLine[] | null;
  truncated: boolean;
}

export interface DiffLine {
  type: "context" | "add" | "del" | "hunk";
  oldN: number | null;
  newN: number | null;
  sym: "+" | "-" | " " | "";
  text: string;
}
