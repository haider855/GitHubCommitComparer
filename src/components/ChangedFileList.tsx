import type { CategoryFilter, ClassifiedChangedFile } from "../types/app";
import { ChangedFileCard } from "./ChangedFileCard";

interface ChangedFileListProps {
  files: ClassifiedChangedFile[];
  selectedCategory: CategoryFilter;
}

export function ChangedFileList({
  files,
  selectedCategory,
}: ChangedFileListProps) {
  return (
    <section className="changed-files" aria-labelledby="changed-files-title">
      <div className="section-heading">
        <h2 id="changed-files-title">Changed Files</h2>
        <p>Expand a file to inspect its diff preview.</p>
      </div>

      {files.length > 0 ? (
        <div className="changed-file-list">
          {files.map((file) => (
            <ChangedFileCard file={file} key={file.filename} />
          ))}
        </div>
      ) : (
        <p className="empty-file-filter">
          No changed files match the {selectedCategory} filter.
        </p>
      )}
    </section>
  );
}
