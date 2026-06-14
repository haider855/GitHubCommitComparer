import type { GitHubCompareFile } from "./github";

export const FILE_CATEGORIES = [
  "UI",
  "Logic",
  "Config",
  "Dependencies",
  "Documentation",
  "Tests",
  "Assets",
  "Build/Tooling",
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
