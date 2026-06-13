import type { CategoryCounts } from "../types/app";
import { FILE_CATEGORIES } from "../types/app";

interface FileCategorySummaryProps {
  categoryCounts: CategoryCounts;
}

export function FileCategorySummary({
  categoryCounts,
}: FileCategorySummaryProps) {
  return (
    <section
      className="category-summary"
      aria-labelledby="category-summary-title"
    >
      <div className="section-heading">
        <h2 id="category-summary-title">Change Categories</h2>
        <p>Changed files grouped by project area.</p>
      </div>

      <dl className="category-grid">
        {FILE_CATEGORIES.map((category) => {
          const count = categoryCounts[category];

          return (
            <div
              className={count > 0 ? "category-item is-active" : "category-item"}
              key={category}
            >
              <dt>{category}</dt>
              <dd>
                {count} {count === 1 ? "file" : "files"}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
