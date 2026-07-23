import { useState } from "react";
import { ChevronDown } from "../../lib/icons";

export default function CollapsibleSection({
  icon: Icon,
  title,
  subtitle,
  children,
  filterNode,
  open: controlledOpen,
  onToggle,
}) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const toggle = () => {
    if (onToggle) {
      onToggle(!open);
    } else {
      setInternalOpen((v) => !v);
    }
  };
  return (
    <section>
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between gap-3 border border-gray-100 rounded-lg px-4 py-3 bg-white sticky top-0 z-10"
      >
        <div className="text-left">
          <h2 className="flex items-center gap-2 text-brand font-semibold text-base">
            <Icon size={16} />
            {title}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-4">
          {filterNode}
          {children}
        </div>
      )}
    </section>
  );
}
