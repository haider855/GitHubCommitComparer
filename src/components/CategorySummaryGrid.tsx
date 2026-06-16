import type { CommitFile } from "../types/app";
import { CAT_COLORS } from "../utils/categories";

interface CategorySummaryGridProps {
  files: CommitFile[];
  activeFilter: string;
  onFilterChange: (category: string) => void;
}

export function CategorySummaryGrid({
  files,
  activeFilter,
  onFilterChange,
}: CategorySummaryGridProps) {
  const entries = getSortedCategoryCounts(files);
  const maxCount = Math.max(...entries.map(([, count]) => count), 1);

  return (
    <section className="category-summary-grid">
      <div className="section-kicker">by category</div>
      <div className="category-cards">
        {entries.map(([category, count]) => {
          const color = CAT_COLORS[category];
          const width = `${(count / maxCount) * 100}%`;

          return (
            <button
              className={
                activeFilter === category
                  ? "category-card active"
                  : "category-card"
              }
              key={category}
              type="button"
              style={{ borderLeftColor: color }}
              onClick={() => onFilterChange(category)}
            >
              <div className="category-card-top">
                <span style={{ color }}>{category}</span>
                <span>{count}</span>
              </div>
              <div className="category-bar">
                <div style={{ width, background: color }} />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function getSortedCategoryCounts(files: CommitFile[]): [string, number][] {
  const counts = files.reduce<Record<string, number>>((result, file) => {
    result[file.cat] = (result[file.cat] ?? 0) + 1;
    return result;
  }, {});

  return Object.entries(counts).sort(([, countA], [, countB]) => countB - countA);
}
