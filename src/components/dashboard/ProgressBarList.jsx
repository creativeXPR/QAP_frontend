import { TrendingUp } from "lucide-react";

export default function ProgressBarList({
  title,
  subtitle,
  trend,
  data,
  barColor = "bg-brand",
}) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="rounded-lg border border-gray-100 bg-white shadow-sm p-5">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
            <TrendingUp size={15} />
            {trend}
          </span>
        )}
      </div>

      <div className="space-y-5">
        {data.map((item) => {
          const pct = (item.value / max) * 100;
          return (
            <div key={item.label} className="flex items-center gap-4">
              <span className="w-10 text-sm text-gray-500">{item.label}</span>
              <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden relative">
                <div
                  className={`h-full ${barColor} rounded-full flex items-center justify-end px-3`}
                  style={{ width: `${pct}%` }}
                >
                  <span className="text-white text-sm font-medium">
                    {item.value}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}