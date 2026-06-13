import type { FileCategory } from "../types/app";

const dependencyFiles = new Set([
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lockb",
  "requirements.txt",
  "pyproject.toml",
  "poetry.lock",
  "pipfile",
  "pipfile.lock",
  "cargo.toml",
  "cargo.lock",
  "go.mod",
  "go.sum",
  "composer.json",
  "composer.lock",
  "gemfile",
  "gemfile.lock",
]);

const buildToolingFiles = new Set([
  "vite.config.ts",
  "vite.config.js",
  "webpack.config.js",
  "rollup.config.js",
  "eslint.config.js",
  "prettier.config.js",
  "postcss.config.js",
  "dockerfile",
  "docker-compose.yml",
]);

const configFiles = new Set([
  ".env.example",
  ".env.local.example",
  ".gitignore",
  ".gitattributes",
  ".editorconfig",
  "tsconfig.json",
  "jsconfig.json",
]);

const documentationFiles = new Set([
  "readme.md",
  "changelog.md",
  "contributing.md",
  "license",
]);

const assetExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".ico",
  ".mp4",
  ".webm",
  ".mp3",
  ".wav",
  ".ttf",
  ".otf",
  ".woff",
  ".woff2",
]);

const logicDirectories = [
  "src/utils/",
  "src/services/",
  "src/hooks/",
  "src/lib/",
  "src/api/",
  "src/store/",
  "src/context/",
];

const uiDirectories = [
  "src/components/",
  "src/pages/",
  "src/views/",
  "src/layouts/",
];

export function classifyFile(filename: string): FileCategory {
  const path = normalizePath(filename);
  const basename = getBasename(path);

  if (dependencyFiles.has(basename)) {
    return "Dependencies";
  }

  if (isBuildToolingFile(path, basename)) {
    return "Build/Tooling";
  }

  if (isConfigFile(path, basename)) {
    return "Config";
  }

  if (isDocumentationFile(path, basename)) {
    return "Documentation";
  }

  if (isTestFile(path, basename)) {
    return "Tests";
  }

  if (isAssetFile(basename)) {
    return "Assets";
  }

  if (isLogicPath(path) && hasExtension(basename, [".ts", ".tsx", ".js", ".jsx"])) {
    return "Logic";
  }

  if (
    uiDirectories.some((directory) => path.startsWith(directory)) ||
    hasExtension(basename, [".css", ".scss", ".sass", ".tsx", ".jsx"])
  ) {
    return "UI";
  }

  if (hasExtension(basename, [".ts", ".js"])) {
    return "Logic";
  }

  return "Other";
}

function isBuildToolingFile(path: string, basename: string): boolean {
  return buildToolingFiles.has(basename) || path.startsWith(".github/workflows/");
}

function isConfigFile(path: string, basename: string): boolean {
  return (
    configFiles.has(basename) ||
    path.includes("config") ||
    hasExtension(basename, [".config.js", ".config.ts", ".config.mjs", ".config.cjs"])
  );
}

function isDocumentationFile(path: string, basename: string): boolean {
  return (
    documentationFiles.has(basename) ||
    path.startsWith("docs/") ||
    hasExtension(basename, [".md", ".mdx"])
  );
}

function isTestFile(path: string, basename: string): boolean {
  return (
    hasExtension(basename, [
      ".test.ts",
      ".test.tsx",
      ".test.js",
      ".test.jsx",
      ".spec.ts",
      ".spec.tsx",
      ".spec.js",
      ".spec.jsx",
    ]) ||
    path.startsWith("__tests__/") ||
    path.includes("/__tests__/") ||
    path.startsWith("tests/") ||
    path.includes("/tests/") ||
    path.startsWith("cypress/") ||
    path.includes("/cypress/") ||
    path.startsWith("playwright/") ||
    path.includes("/playwright/")
  );
}

function isAssetFile(basename: string): boolean {
  return getExtensions(basename).some((extension) => assetExtensions.has(extension));
}

function isLogicPath(path: string): boolean {
  return logicDirectories.some((directory) => path.startsWith(directory));
}

function hasExtension(filename: string, extensions: string[]): boolean {
  return extensions.some((extension) => filename.endsWith(extension));
}

function getExtensions(filename: string): string[] {
  const firstDotIndex = filename.indexOf(".");

  if (firstDotIndex === -1) {
    return [];
  }

  return filename
    .slice(firstDotIndex)
    .split(".")
    .filter(Boolean)
    .map((part) => `.${part}`);
}

function getBasename(path: string): string {
  return path.split("/").at(-1) ?? path;
}

function normalizePath(filename: string): string {
  return filename.trim().replace(/\\/g, "/").replace(/^\/+/, "").toLowerCase();
}
