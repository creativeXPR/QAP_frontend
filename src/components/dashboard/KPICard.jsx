import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, ChevronDown } from "../../lib/icons";

const STATUS_STYLES = {
  improving: {
    icon: TrendingUp,
    label: "Improving",
    className: "text-emerald-600 bg-emerald-50",
  },
  stable: {
    icon: Minus,
    label: "Stable",
    className: "text-amber-600 bg-amber-50",
  },
  declining: {
    icon: TrendingDown,
    label: "Declining",
    className: "text-red-500 bg-red-50",
  },
};

export default function KPICard({ kpi }) {
  const [open, setOpen] = useState(false);
  const {
    icon: StatusIcon,
    label,
    className: statusClass,
  } = STATUS_STYLES[kpi.status] || STATUS_STYLES.stable;

  return (
    <div className="border border-gray-100 rounded-lg bg-white overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left"
      >
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{kpi.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5 capitalize">
            {kpi.category}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${statusClass}`}
          >
            <StatusIcon size={12} />
            {label}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-semibold text-brand">
              {kpi.value}
            </span>
            <span className="text-xs text-gray-400">
              {kpi.changePercent} ({kpi.changePeriod})
            </span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            {kpi.analysisText}
          </p>
          {Object.keys(kpi.metrics).length > 0 && (
            <div className="space-y-2 mt-3">
              {Object.entries(kpi.metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="capitalize text-gray-500">
                    {key.replace(/_/g, " ")}
                  </span>

                  <span className="font-semibold text-brand">{value}</span>
                </div>
              ))}
            </div>
          )}

          {kpi.embedLink && (
            <iframe
              src={kpi.embedLink}
              title={kpi.title}
              className="w-full h-96 rounded-lg border mt-4"
              loading="lazy"
            />
          )}
        </div>
      )}
    </div>
  );
}
