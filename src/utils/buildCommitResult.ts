import type {
  ClassifiedChangedFile,
  CommitFile,
  CommitResult,
  DiffLine,
} from "../types/app";
import type {
  GitHubCommitResponse,
} from "../types/github";

const MAX_DIFF_LINES = 200;

interface BuildCommitResultInput {
  commitData: GitHubCommitResponse;
  classifiedFiles: ClassifiedChangedFile[];
  parentSha: string;
}

export function buildCommitResult({
  commitData,
  classifiedFiles,
  parentSha,
}: BuildCommitResultInput): CommitResult {
  const files = classifiedFiles.map(toCommitFile);

  return {
    message: commitData.commit.message,
    author: commitData.author?.login ?? commitData.commit.author.name,
    date: formatCommitDate(commitData.commit.author.date),
    sha: commitData.sha,
    parentSha,
    url: commitData.html_url,
    filesChanged: files.length,
    additions: files.reduce((total, file) => total + file.additions, 0),
    deletions: files.reduce((total, file) => total + file.deletions, 0),
    files,
  };
}

function toCommitFile(file: ClassifiedChangedFile): CommitFile {
  const parsedDiff = parseDiff(file.patch);

  return {
    path: file.filename,
    cat: file.category,
    additions: file.additions,
    deletions: file.deletions,
    diff: parsedDiff.lines,
    truncated: parsedDiff.truncated,
  };
}

function parseDiff(patch?: string): { lines: DiffLine[] | null; truncated: boolean } {
  if (!patch) {
    return {
      lines: null,
      truncated: false,
    };
  }

  const patchLines = patch.split(/\r?\n/);
  const visibleLines = patchLines.slice(0, MAX_DIFF_LINES);
  let oldLine = 0;
  let newLine = 0;

  return {
    lines: visibleLines.map((line) => {
      const hunkMatch = line.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);

      if (hunkMatch) {
        oldLine = Number(hunkMatch[1]);
        newLine = Number(hunkMatch[2]);

        return {
          type: "hunk",
          oldN: null,
          newN: null,
          sym: "",
          text: line,
        };
      }

      if (line.startsWith("+")) {
        const diffLine: DiffLine = {
          type: "add",
          oldN: null,
          newN: newLine,
          sym: "+",
          text: line.slice(1),
        };
        newLine += 1;
        return diffLine;
      }

      if (line.startsWith("-")) {
        const diffLine: DiffLine = {
          type: "del",
          oldN: oldLine,
          newN: null,
          sym: "-",
          text: line.slice(1),
        };
        oldLine += 1;
        return diffLine;
      }

      const text = line.startsWith(" ") ? line.slice(1) : line;
      const diffLine: DiffLine = {
        type: "context",
        oldN: oldLine,
        newN: newLine,
        sym: " ",
        text,
      };
      oldLine += 1;
      newLine += 1;
      return diffLine;
    }),
    truncated: patchLines.length > MAX_DIFF_LINES,
  };
}

function formatCommitDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
