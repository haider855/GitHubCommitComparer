import type { CommitResult, DiffLine } from "../types/app";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const OPENAI_SUMMARY_MODEL = "gpt-5.5";
const MAX_FILES_IN_PROMPT = 12;
const MAX_DIFF_LINES_PER_FILE = 30;
const MAX_DIFF_LINE_LENGTH = 180;

interface GenerateAiCommitSummaryInput {
  apiKey: string;
  commit: CommitResult;
}

interface OpenAIErrorPayload {
  error?: {
    message?: string;
  };
}

interface OpenAIResponsePayload extends OpenAIErrorPayload {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
    }>;
  }>;
}

export class OpenAiSummaryError extends Error {
  constructor(public readonly userMessage: string) {
    super(userMessage);
    this.name = "OpenAiSummaryError";
  }
}

export async function generateAiCommitSummary({
  apiKey,
  commit,
}: GenerateAiCommitSummaryInput): Promise<string> {
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: OPENAI_SUMMARY_MODEL,
      reasoning: { effort: "low" },
      max_output_tokens: 650,
      instructions:
        "You explain GitHub commits for developers. Be concise, specific, and grounded only in the supplied commit data. Do not invent intent. Return plain text with short sections: Summary, Main changes, Risk areas.",
      input: buildCommitSummaryInput(commit),
    }),
  });

  const payload = await readJson(response);

  if (!response.ok) {
    throw new OpenAiSummaryError(toUserMessage(response.status, payload));
  }

  const summary = extractOutputText(payload);

  if (!summary) {
    throw new OpenAiSummaryError("The AI response did not include a summary.");
  }

  return summary;
}

function buildCommitSummaryInput(commit: CommitResult): string {
  const promptFiles = commit.files.slice(0, MAX_FILES_IN_PROMPT).map((file) => ({
    path: file.path,
    category: file.cat,
    additions: file.additions,
    deletions: file.deletions,
    truncated: file.truncated,
    diff:
      file.diff
        ?.slice(0, MAX_DIFF_LINES_PER_FILE)
        .map(formatDiffLine)
        .join("\n") ?? "No text diff available.",
  }));

  return JSON.stringify(
    {
      commit: {
        message: commit.message,
        author: commit.author,
        date: commit.date,
        sha: commit.sha,
        parentSha: commit.parentSha,
        filesChanged: commit.filesChanged,
        additions: commit.additions,
        deletions: commit.deletions,
      },
      files: promptFiles,
      omittedFiles: Math.max(0, commit.files.length - promptFiles.length),
    },
    null,
    2,
  );
}

function formatDiffLine(line: DiffLine): string {
  const value = `${line.sym}${line.text}`;

  if (value.length <= MAX_DIFF_LINE_LENGTH) {
    return value;
  }

  return `${value.slice(0, MAX_DIFF_LINE_LENGTH)}...`;
}

async function readJson(response: Response): Promise<OpenAIResponsePayload> {
  try {
    return (await response.json()) as OpenAIResponsePayload;
  } catch {
    return {};
  }
}

function extractOutputText(payload: OpenAIResponsePayload): string {
  if (typeof payload.output_text === "string") {
    return payload.output_text.trim();
  }

  return (
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .filter((text): text is string => Boolean(text))
      .join("\n")
      .trim() ?? ""
  );
}

function toUserMessage(
  status: number,
  payload: OpenAIErrorPayload,
): string {
  const detail = payload.error?.message;

  if (status === 401) {
    return "The API key was rejected. Check the key and try again.";
  }

  if (status === 429) {
    return "The AI request was rate limited. Wait a moment and try again.";
  }

  if (status >= 500) {
    return "The AI service is unavailable right now. Try again later.";
  }

  return detail || "The AI summary request failed.";
}
