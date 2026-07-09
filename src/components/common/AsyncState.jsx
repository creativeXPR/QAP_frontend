/**
 * Wraps a loading/error/empty/success cycle for a fetched list, matching
 * the plain-text loading/empty style already used across the student
 * pages (e.g. "Loading submissions...", "No submissions found."),
 * extended with an error line + inline Retry action.
 */
export default function AsyncState({
  loading,
  error,
  empty,
  onRetry,
  loadingLabel = "Loading...",
  emptyLabel = "Nothing to show yet.",
  children,
}) {
  if (loading) {
    return <p className="text-sm text-gray-500 py-4">{loadingLabel}</p>;
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 text-sm text-red-500 py-4">
        <span>{error.message || "Something went wrong. Please try again."}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="font-medium text-brand hover:underline shrink-0"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (empty) {
    return <p className="text-sm text-gray-500 py-4">{emptyLabel}</p>;
  }

  return children;
}
