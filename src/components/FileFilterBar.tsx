import type { CategoryFilter } from "../types/app";
import { FILE_CATEGORIES } from "../types/app";

interface FileFilterBarProps {
  selectedCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
}

const filterOptions = ["All", ...FILE_CATEGORIES] as const;

export function FileFilterBar({
  selectedCategory,
  onSelectCategory,
}: FileFilterBarProps) {
  return (
    <div className="file-filter-bar" aria-label="Filter changed files">
      {filterOptions.map((category) => (
        <button
          className={
            selectedCategory === category
              ? "filter-button is-active"
              : "filter-button"
          }
          key={category}
          type="button"
          aria-pressed={selectedCategory === category}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
