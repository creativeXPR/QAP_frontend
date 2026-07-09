import { useState } from "react";
import { ChevronDown, ChevronRight } from "../../lib/icons";

export default function CollapsibleSection({ title, defaultOpen = true, children, subtitle, actionNode }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm mb-6 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 text-left transition-colors"
      >
        <div>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {actionNode && (
            <div onClick={(e) => e.stopPropagation()}>
              {actionNode}
            </div>
          )}
          <span className="text-gray-400">
            {open ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </span>
        </div>
      </button>
      
      {open && <div className="p-4 border-t border-gray-100">{children}</div>}
    </div>
  );
}
