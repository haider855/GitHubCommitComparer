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
    {
      notFoundMessage:
        "GitHub could not find this commit in the selected repository. Confirm the repository is public and the commit exists.",
      validationMessage:
        "GitHub could not validate this commit reference. Check the repository and commit input.",
    },
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
    {
      notFoundMessage:
        "GitHub could not find one of the commits needed for this comparison.",
      validationMessage:
        "GitHub could not validate this parent commit comparison.",
    },
  );
}

interface GitHubErrorMessages {
  notFoundMessage: string;
  validationMessage: string;
}

async function requestGitHub<TResponse>(
  path: string,
  errorMessages: GitHubErrorMessages,
): Promise<TResponse> {
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
    throw await createGitHubApiError(response, errorMessages);
  }

  return response.json() as Promise<TResponse>;
}

function encodePathPart(value: string): string {
  return encodeURIComponent(value.trim());
}

async function createGitHubApiError(
  response: Response,
  errorMessages: GitHubErrorMessages,
): Promise<GitHubApiError> {
  const { status } = response;
  const gitHubMessage = await readGitHubErrorMessage(response);

  if (status === 400) {
    return new GitHubApiError(
      status,
      "Bad GitHub request",
      "GitHub could not process this commit request.",
    );
  }

  if (status === 403) {
    const remainingRequests = response.headers.get("x-ratelimit-remaining");

    if (remainingRequests === "0" || isRateLimitMessage(gitHubMessage)) {
      return new GitHubApiError(
        status,
        "GitHub API rate limit reached",
        "GitHub API rate limit reached. Try again later.",
      );
    }

    return new GitHubApiError(
      status,
      "GitHub request forbidden",
      "GitHub refused this request. The repository may be unavailable, blocked, or temporarily restricted.",
    );
  }

  if (status === 401) {
    return new GitHubApiError(
      status,
      "GitHub request unauthorized",
      "GitHub refused this unauthenticated request. Only public repositories are supported in the MVP.",
    );
  }

  if (status === 404) {
    return new GitHubApiError(
      status,
      "Repository or commit not found",
      errorMessages.notFoundMessage,
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
      errorMessages.validationMessage,
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

async function readGitHubErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: unknown };
    return typeof body.message === "string" ? body.message : "";
  } catch {
    return "";
  }
}

function isRateLimitMessage(message: string): boolean {
  return message.toLowerCase().includes("rate limit");
}
