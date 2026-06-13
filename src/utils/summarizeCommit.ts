import type {
  CategoryCounts,
  ClassifiedChangedFile,
} from "../types/app";
import { FILE_CATEGORIES } from "../types/app";

interface SummarizeCommitInput {
  commitMessage: string;
  files: ClassifiedChangedFile[];
  categoryCounts: CategoryCounts;
}

export function summarizeCommit({
  commitMessage,
  files,
  categoryCounts,
}: SummarizeCommitInput): string {
  const fileCount = files.length;
  const additions = files.reduce((total, file) => total + file.additions, 0);
  const deletions = files.reduce((total, file) => total + file.deletions, 0);
  const summaryParts = [
    `This commit changed ${formatCount(fileCount, "file")} with ${formatCount(
      additions,
      "addition",
    )} and ${formatCount(deletions, "deletion")}.`,
    getDominantCategorySummary(categoryCounts),
    getStatusSummary(files),
    getPresenceSummary(categoryCounts),
    getCommitMessageSummary(commitMessage),
  ];

  return summaryParts.filter(Boolean).join(" ");
}

function getDominantCategorySummary(categoryCounts: CategoryCounts): string {
  const activeCategories = FILE_CATEGORIES.filter(
    (category) => categoryCounts[category] > 0,
  );

  if (activeCategories.length === 0) {
    return "No changed file categories were detected.";
  }

  const highestCount = Math.max(
    ...activeCategories.map((category) => categoryCounts[category]),
  );
  const dominantCategories = activeCategories.filter(
    (category) => categoryCounts[category] === highestCount,
  );

  if (dominantCategories.length === 1) {
    return `Most changes were in ${dominantCategories[0]} files.`;
  }

  if (dominantCategories.length === 2) {
    return `Most changes were split between ${dominantCategories[0]} and ${dominantCategories[1]} files.`;
  }

  return "Changes were spread across multiple areas of the project.";
}

function getStatusSummary(files: ClassifiedChangedFile[]): string {
  const statusCounts = files.reduce<Record<string, number>>((counts, file) => {
    counts[file.status] = (counts[file.status] ?? 0) + 1;
    return counts;
  }, {});
  const statusParts = [
    formatStatusCount(statusCounts.added, "added"),
    formatStatusCount(statusCounts.modified, "modified"),
    formatStatusCount(statusCounts.removed, "removed"),
    formatStatusCount(statusCounts.renamed, "renamed"),
  ].filter((value): value is string => value !== null);

  if (statusParts.length === 0) {
    return "";
  }

  return `File statuses: ${joinList(statusParts)}.`;
}

function getPresenceSummary(categoryCounts: CategoryCounts): string {
  const statements = [
    categoryCounts.Dependencies > 0
      ? "Dependency files changed."
      : "No dependency files were changed.",
    categoryCounts.Config > 0 || categoryCounts["Build/Tooling"] > 0
      ? "Configuration or build tooling changed."
      : "No configuration or build tooling files were changed.",
    categoryCounts.Tests > 0
      ? "Test files changed."
      : "No test files were changed.",
    categoryCounts.Documentation > 0
      ? "Documentation files changed."
      : "No documentation files were changed.",
  ];

  return statements.join(" ");
}

function getCommitMessageSummary(commitMessage: string): string {
  const firstLine = commitMessage.trim().split(/\r?\n/)[0];

  if (!firstLine) {
    return "";
  }

  return `Commit message: "${firstLine}".`;
}

function formatCount(count: number, singularLabel: string): string {
  return `${count} ${count === 1 ? singularLabel : `${singularLabel}s`}`;
}

function formatStatusCount(
  count: number | undefined,
  label: string,
): string | null {
  if (!count) {
    return null;
  }

  return `${count} ${label}`;
}

function joinList(values: string[]): string {
  if (values.length <= 1) {
    return values[0] ?? "";
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}
