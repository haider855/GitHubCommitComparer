interface CommitFormProps {
  repoInput: string;
  commitInput: string;
  isLoading: boolean;
  onRepoInputChange: (value: string) => void;
  onCommitInputChange: (value: string) => void;
  onSubmit: () => void;
}

export function CommitForm({
  repoInput,
  commitInput,
  isLoading,
  onRepoInputChange,
  onCommitInputChange,
  onSubmit,
}: CommitFormProps) {
  return (
    <form
      className="commit-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor="repository-url">
        Repository URL
        <input
          id="repository-url"
          name="repository-url"
          type="text"
          autoComplete="off"
          placeholder="https://github.com/facebook/react"
          value={repoInput}
          disabled={isLoading}
          onChange={(event) => onRepoInputChange(event.target.value)}
        />
      </label>

      <label htmlFor="commit-ref">
        Commit URL or SHA
        <input
          id="commit-ref"
          name="commit-ref"
          type="text"
          autoComplete="off"
          placeholder="https://github.com/facebook/react/commit/..."
          value={commitInput}
          disabled={isLoading}
          onChange={(event) => onCommitInputChange(event.target.value)}
        />
      </label>

      <button type="submit" disabled={isLoading}>
        Analyze Commit
      </button>
    </form>
  );
}
