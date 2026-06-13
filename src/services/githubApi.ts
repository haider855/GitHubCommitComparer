import type {
  GitHubCommitResponse,
  GitHubCompareResponse,
} from "../types/github";

export class GitHubApiError extends Error {
  status: number;
  title: string;
  userMessage: string;

  constructor(status: number, title: string, userMessage: string) {
    super(userMessage);
    this.name = "GitHubApiError";
    this.status = status;
    this.title = title;
    this.userMessage = userMessage;
  }
}

const GITHUB_API_BASE_URL = "https://api.github.com";
const GITHUB_API_HEADERS = {
  Accept: "application/vnd.github+json",
};

export async function getCommit(
  owner: string,
  repo: string,
  ref: string,
): Promise<GitHubCommitResponse> {
  return requestGitHub<GitHubCommitResponse>(
    `/repos/${encodePathPart(owner)}/${encodePathPart(repo)}/commits/${encodePathPart(ref)}`,
  );
}

export async function compareCommits(
  owner: string,
  repo: string,
  baseSha: string,
  headSha: string,
): Promise<GitHubCompareResponse> {
  return requestGitHub<GitHubCompareResponse>(
    `/repos/${encodePathPart(owner)}/${encodePathPart(repo)}/compare/${encodePathPart(baseSha)}...${encodePathPart(headSha)}`,
  );
}

async function requestGitHub<TResponse>(path: string): Promise<TResponse> {
  let response: Response;

  try {
    response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
      headers: GITHUB_API_HEADERS,
    });
  } catch {
    throw new GitHubApiError(
      0,
      "Network error",
      "Could not reach GitHub. Check your connection and try again.",
    );
  }

  if (!response.ok) {
    throw createGitHubApiError(response.status);
  }

  return response.json() as Promise<TResponse>;
}

function encodePathPart(value: string): string {
  return encodeURIComponent(value.trim());
}

function createGitHubApiError(status: number): GitHubApiError {
  if (status === 400) {
    return new GitHubApiError(
      status,
      "Bad GitHub request",
      "GitHub could not process this commit request.",
    );
  }

  if (status === 403) {
    return new GitHubApiError(
      status,
      "GitHub API limit reached",
      "GitHub API rate limit reached. Try again later.",
    );
  }

  if (status === 404) {
    return new GitHubApiError(
      status,
      "Repository or commit not found",
      "GitHub could not find this repository or commit. Confirm the repository is public and the commit exists.",
    );
  }

  if (status === 409) {
    return new GitHubApiError(
      status,
      "Repository conflict",
      "GitHub could not process this repository.",
    );
  }

  if (status === 422) {
    return new GitHubApiError(
      status,
      "Validation failed",
      "GitHub could not validate this commit comparison.",
    );
  }

  if (status === 500) {
    return new GitHubApiError(
      status,
      "GitHub server error",
      "GitHub had a server error. Try again later.",
    );
  }

  if (status === 503) {
    return new GitHubApiError(
      status,
      "GitHub unavailable",
      "GitHub is temporarily unavailable. Try again later.",
    );
  }

  return new GitHubApiError(
    status,
    "GitHub request failed",
    "GitHub could not complete this request. Try again later.",
  );
}
