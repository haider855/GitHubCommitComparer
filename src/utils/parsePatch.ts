export type PatchLineType = "addition" | "deletion" | "hunk" | "context";

export interface ParsedPatchLine {
  content: string;
  type: PatchLineType;
}

export interface ParsedPatch {
  lines: ParsedPatchLine[];
  isTruncated: boolean;
}

const MAX_PATCH_LINES = 200;

export function parsePatch(patch: string): ParsedPatch {
  const lines = patch.split(/\r?\n/);
  const visibleLines = lines.slice(0, MAX_PATCH_LINES);

  return {
    lines: visibleLines.map((line) => ({
      content: line,
      type: getPatchLineType(line),
    })),
    isTruncated: lines.length > MAX_PATCH_LINES,
  };
}

function getPatchLineType(line: string): PatchLineType {
  if (line.startsWith("@@")) {
    return "hunk";
  }

  if (line.startsWith("+++") || line.startsWith("---")) {
    return "context";
  }

  if (line.startsWith("+")) {
    return "addition";
  }

  if (line.startsWith("-")) {
    return "deletion";
  }

  return "context";
}
