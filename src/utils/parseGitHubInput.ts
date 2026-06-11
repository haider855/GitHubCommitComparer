import type { AppError, ParsedGitHubInput } from "../types/app";

type ParseResult =
  | {
      ok: true;
      value: ParsedGitHubInput;
    }
  | {
      ok: false;
      error: AppError;
    };

interface RepositoryParts {
  owner: string;
  repo: string;
}

const repositoryInputError: AppError = {
  title: "Invalid repository URL",
  message:
    "The repository URL is not valid. Enter a GitHub repository like https://github.com/owner/repo.",
};

const commitInputError: AppError = {
  title: "Invalid commit input",
  message: "The commit input is not valid. Enter a commit URL or commit SHA.",
};

export function parseGitHubInput(
  repoInput: string,
  commitInput: string,
): ParseResult {
  if (!repoInput.trim()) {
    return {
      ok: false,
      error: {
        title: "Repository URL required",
        message: "Enter a public GitHub repository URL or owner/repo value.",
      },
    };
  }

  if (!commitInput.trim()) {
    return {
      ok: false,
      error: {
        title: "Commit required",
        message: "Enter a commit URL or commit SHA.",
      },
    };
  }

  const repository = parseRepositoryInput(repoInput);

  if (!repository) {
    return {
      ok: false,
      error: repositoryInputError,
    };
  }

  const commit = parseCommitInput(commitInput, repository);

  if (!commit.ok) {
    return commit;
  }

  return {
    ok: true,
    value: {
      owner: repository.owner,
      repo: repository.repo,
      commitSha: commit.value,
    },
  };
}

function parseRepositoryInput(input: string): RepositoryParts | null {
  const value = input.trim();

  if (isGitHubUrlLike(value)) {
    const url = toGitHubUrl(value);

    if (!url) {
      return null;
    }

    const parts = getCleanPathParts(url.pathname);

    if (parts.length !== 2) {
      return null;
    }

    return normalizeRepositoryParts(parts[0], parts[1]);
  }

  const parts = getCleanPathParts(value);

  if (parts.length !== 2) {
    return null;
  }

  return normalizeRepositoryParts(parts[0], parts[1]);
}

function parseCommitInput(
  input: string,
  repository: RepositoryParts,
): { ok: true; value: string } | { ok: false; error: AppError } {
  const value = input.trim();

  if (isGitHubUrlLike(value)) {
    const url = toGitHubUrl(value);

    if (!url) {
      return {
        ok: false,
        error: commitInputError,
      };
    }

    const parts = getCleanPathParts(url.pathname);

    if (parts.length !== 4 || parts[2] !== "commit") {
      return {
        ok: false,
        error: commitInputError,
      };
    }

    const commitRepository = normalizeRepositoryParts(parts[0], parts[1]);

    if (!commitRepository) {
      return {
        ok: false,
        error: commitInputError,
      };
    }

    if (
      commitRepository.owner.toLowerCase() !== repository.owner.toLowerCase() ||
      commitRepository.repo.toLowerCase() !== repository.repo.toLowerCase()
    ) {
      return {
        ok: false,
        error: {
          title: "Repository mismatch",
          message:
            "The repository URL and commit URL point to different repositories.",
        },
      };
    }

    return validateCommitSha(parts[3]);
  }

  return validateCommitSha(value);
}

function validateCommitSha(value: string):
  | {
      ok: true;
      value: string;
    }
  | {
      ok: false;
      error: AppError;
    } {
  const commitSha = value.trim();

  if (commitSha.length < 4) {
    return {
      ok: false,
      error: {
        title: "Commit SHA too short",
        message: "Enter at least the first 4 characters of the commit SHA.",
      },
    };
  }

  if (!/^[a-f0-9]{4,40}$/i.test(commitSha)) {
    return {
      ok: false,
      error: commitInputError,
    };
  }

  return {
    ok: true,
    value: commitSha,
  };
}

function normalizeRepositoryParts(
  owner: string | undefined,
  repo: string | undefined,
): RepositoryParts | null {
  if (!owner || !repo) {
    return null;
  }

  const cleanRepo = repo.replace(/\.git$/i, "");

  if (!isValidRepositoryName(owner) || !isValidRepositoryName(cleanRepo)) {
    return null;
  }

  return {
    owner,
    repo: cleanRepo,
  };
}

function isValidRepositoryName(value: string): boolean {
  return /^[a-z0-9._-]+$/i.test(value);
}

function isGitHubUrlLike(value: string): boolean {
  return /^https?:\/\//i.test(value) || /^github\.com\//i.test(value);
}

function toGitHubUrl(value: string): URL | null {
  const normalizedValue = /^github\.com\//i.test(value)
    ? `https://${value}`
    : value;

  try {
    const url = new URL(normalizedValue);

    if (url.hostname.toLowerCase() !== "github.com") {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

function getCleanPathParts(path: string): string[] {
  return path
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);
}
