import type { CommitFile } from "../types/app";
import { EmptyState } from "./EmptyState";
import { FileCard } from "./FileCard";

interface FileListProps {
  files: CommitFile[];
  activeFilter: string;
}

export function FileList({ files, activeFilter }: FileListProps) {
  const visibleFiles =
    activeFilter === "all"
      ? files
      : files.filter((file) => file.cat === activeFilter);

  if (visibleFiles.length === 0) {
    return <EmptyState icon="filter-off" title="No files in this category" />;
  }

  return (
    <div className="file-list">
      {visibleFiles.map((file) => (
        <FileCard file={file} key={file.path} />
      ))}
    </div>
  );
}
