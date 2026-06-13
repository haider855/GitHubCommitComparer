export interface GitHubCommitParent {
  sha: string;
  url: string;
  html_url?: string;
}

export interface GitHubCommitResponse {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
  };
  author: {
    login: string;
    html_url: string;
    avatar_url: string;
  } | null;
  parents: GitHubCommitParent[];
}

export interface GitHubCompareFile {
  sha: string;
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  blob_url?: string;
  raw_url?: string;
  contents_url?: string;
  patch?: string;
  previous_filename?: string;
}

export interface GitHubCompareResponse {
  html_url: string;
  status: string;
  ahead_by: number;
  behind_by: number;
  total_commits: number;
  files?: GitHubCompareFile[];
}
