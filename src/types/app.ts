import type { GitHubCompareFile } from "./github";

export type FileCategory =
  | "UI"
  | "Logic"
  | "Config"
  | "Dependencies"
  | "Documentation"
  | "Tests"
  | "Assets"
  | "Build/Tooling"
  | "Other";

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
