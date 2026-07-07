/**
 * Two visual variants, matching the two card styles in the design:
 *
 * variant="overview" — used in the System Overview strip.
 *   [icon box]                    [• trend pill]
 *   Big value
 *   Small gray label
 *
 * variant="metric" (default) — used for Submission Rate / Completion
 * Statistics style cards.
 *   [icon] Label
 *   Big value
 *   Small gray caption
 *   [progress bar]
 */
export default function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendPositive = true,
  caption,
  progress,
  progressColor = "bg-emerald-500",
  variant = "metric",
}) {
  if (variant === "overview") {
    return (
      <div className="rounded-lg border border-gray-100 bg-white shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-50 text-gray-500">
            {Icon && <Icon size={16} />}
          </span>
          {trend && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                trendPositive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-500"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  trendPositive ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              {trend}
            </span>
          )}
        </div>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{label}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-gray-500 text-xs">
          {Icon && <Icon size={14} />}
          <span>{label}</span>
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
              trendPositive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                trendPositive ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {trend}
          </span>
        )}
      </div>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
      {caption && <p className="text-xs text-gray-400 mt-1">{caption}</p>}

      {progress !== undefined && (
        <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${progressColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}