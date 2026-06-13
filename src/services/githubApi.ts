import type {
  GitHubCommitResponse,
  GitHubCompareResponse,
} from "../types/github";

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
  const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
    headers: GITHUB_API_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed with status ${response.status}.`);
  }

  return response.json() as Promise<TResponse>;
}

function encodePathPart(value: string): string {
  return encodeURIComponent(value.trim());
}
