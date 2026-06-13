import type { GitHubCommitResponse } from "../types/github";

interface CommitOverviewProps {
  commit: GitHubCommitResponse;
}

export function CommitOverview({ commit }: CommitOverviewProps) {
  return (
    <section className="commit-overview" aria-labelledby="commit-overview-title">
      <div className="section-heading">
        <h2 id="commit-overview-title">Commit Overview</h2>
        <p>Basic metadata from the selected GitHub commit.</p>
      </div>

      <div className="commit-message">
        <span>Commit message</span>
        <p>{commit.commit.message}</p>
      </div>

      <dl className="commit-details">
        <div>
          <dt>Author</dt>
          <dd>{commit.commit.author.name}</dd>
        </div>
        <div>
          <dt>Date</dt>
          <dd>{formatCommitDate(commit.commit.author.date)}</dd>
        </div>
        <div>
          <dt>Selected commit SHA</dt>
          <dd>{commit.sha}</dd>
        </div>
      </dl>
    </section>
  );
}

function formatCommitDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
