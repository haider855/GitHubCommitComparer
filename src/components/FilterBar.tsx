import type { CommitFile } from "../types/app";
import { CAT_COLORS } from "../utils/categories";

interface FilterBarProps {
  files: CommitFile[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FilterBar({
  files,
  activeFilter,
  onFilterChange,
}: FilterBarProps) {
  const categoryCounts = getCategoryCounts(files);
  const categories = Object.entries(categoryCounts).sort(
    ([, countA], [, countB]) => countB - countA,
  );

  return (
    <div className="filter-bar">
      <span className="filter-label">filter</span>
      <button
        className={activeFilter === "all" ? "filter-pill active" : "filter-pill"}
        type="button"
        onClick={() => onFilterChange("all")}
      >
        all <span>{files.length}</span>
      </button>
      {categories.map(([category, count]) => (
        <button
          className={
            activeFilter === category ? "filter-pill active" : "filter-pill"
          }
          key={category}
          type="button"
          onClick={() => onFilterChange(category)}
        >
          <span
            className="filter-dot"
            style={{ background: CAT_COLORS[category] }}
          />
          {category}
          <span>{count}</span>
        </button>
      ))}
    </div>
  );
}

function getCategoryCounts(files: CommitFile[]): Record<string, number> {
  return files.reduce<Record<string, number>>((result, file) => {
    result[file.cat] = (result[file.cat] ?? 0) + 1;
    return result;
  }, {});
}
