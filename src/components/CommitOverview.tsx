import type { CommitResult } from "../types/app";

interface CommitOverviewProps {
  data: CommitResult;
}

export function CommitOverview({ data }: CommitOverviewProps) {
  return (
    <section className="commit-overview">
      <p className="commit-message">{data.message}</p>

      <div className="meta-chips">
        <span className="meta-chip">
          <i className="ti ti-user" aria-hidden="true" />
          {data.author}
        </span>
        <span className="meta-chip">
          <i className="ti ti-calendar" aria-hidden="true" />
          {data.date}
        </span>
        <span className="meta-chip">
          <i className="ti ti-git-commit" aria-hidden="true" />
          {shortSha(data.sha)}
        </span>
        <span className="meta-chip">
          <i className="ti ti-arrow-left" aria-hidden="true" />
          parent {shortSha(data.parentSha)}
        </span>
        <a
          className="meta-chip meta-link"
          href={data.url}
          target="_blank"
          rel="noreferrer"
        >
          <i className="ti ti-external-link" aria-hidden="true" />
          view on GitHub
        </a>
      </div>

      <dl className="stats-row">
        <div>
          <dt>Files changed</dt>
          <dd>{data.filesChanged}</dd>
        </div>
        <div>
          <dt>Additions</dt>
          <dd className="stat-additions">+{data.additions}</dd>
        </div>
        <div>
          <dt>Deletions</dt>
          <dd className="stat-deletions">-{data.deletions}</dd>
        </div>
      </dl>
    </section>
  );
}

function shortSha(sha: string): string {
  return sha.slice(0, 8);
}
