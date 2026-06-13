import type {
  GitHubCommitResponse,
  GitHubCompareResponse,
} from "../types/github";

interface CommitOverviewProps {
  commit: GitHubCommitResponse;
  compare: GitHubCompareResponse;
  parentSha: string;
}

export function CommitOverview({
  commit,
  compare,
  parentSha,
}: CommitOverviewProps) {
  const files = compare.files ?? [];
  const additions = files.reduce((total, file) => total + file.additions, 0);
  const deletions = files.reduce((total, file) => total + file.deletions, 0);

  return (
    <section className="commit-overview" aria-labelledby="commit-overview-title">
      <div className="section-heading">
        <h2 id="commit-overview-title">Commit Overview</h2>
        <p>Metadata and totals from the parent comparison.</p>
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
        <div>
          <dt>Parent commit SHA</dt>
          <dd>{parentSha}</dd>
        </div>
        <div>
          <dt>GitHub commit</dt>
          <dd>
            <a
              className="commit-link"
              href={commit.html_url}
              target="_blank"
              rel="noreferrer"
            >
              Open commit
            </a>
          </dd>
        </div>
        <div>
          <dt>Files changed</dt>
          <dd>{files.length}</dd>
        </div>
        <div>
          <dt>Additions</dt>
          <dd className="additions-count">+{additions}</dd>
        </div>
        <div>
          <dt>Deletions</dt>
          <dd className="deletions-count">-{deletions}</dd>
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
