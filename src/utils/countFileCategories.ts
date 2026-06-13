import type { CategoryCounts, ClassifiedChangedFile } from "../types/app";
import { FILE_CATEGORIES } from "../types/app";

export function countFileCategories(
  files: ClassifiedChangedFile[],
): CategoryCounts {
  const counts = createEmptyCategoryCounts();

  for (const file of files) {
    counts[file.category] += 1;
  }

  return counts;
}

function createEmptyCategoryCounts(): CategoryCounts {
  return FILE_CATEGORIES.reduce((counts, category) => {
    counts[category] = 0;
    return counts;
  }, {} as CategoryCounts);
}
