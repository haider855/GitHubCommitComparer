export interface ParsedGitHubInput {
  owner: string;
  repo: string;
  commitSha: string;
}

export interface AppError {
  title: string;
  message: string;
}
