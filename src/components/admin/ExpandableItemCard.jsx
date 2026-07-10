import { useState } from "react";
import { FileText, Calendar, ChevronDown, ChevronRight, Pencil, Trash2 } from "../../lib/icons";

export default function ExpandableItemCard({
  item,
  title,
  subtitle,
  badge,
  badgeColor = "bg-gray-100 text-gray-600",
  meta,
  icon: Icon = FileText,
  onEdit,
  onDelete,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-lg hover:shadow-sm transition-shadow bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-4 p-4 text-left focus:outline-none"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand/5 text-brand shrink-0">
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{title}</h3>
            {badge && (
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-gray-600 mb-1">{subtitle}</p>}
          {meta && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
              <Calendar size={12} />
              <span>{meta}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0 text-gray-400 self-center">
          {onEdit && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="p-1 hover:text-brand hover:bg-brand/5 rounded transition-colors"
              title="Edit Update"
            >
              <Pencil size={16} />
            </div>
          )}
          {onDelete && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              className="p-1 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Delete Update"
            >
              <Trash2 size={16} />
            </div>
          )}
          {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4 bg-gray-50/30">
          <div className="pl-14">
            <p className="text-xs font-semibold text-gray-500 mb-1">Description:</p>
            <p className="text-sm text-gray-700 whitespace-pre-line mb-4">
              {item?.description || "No description provided."}
            </p>
            
            {item?.button?.label && item?.button?.url && (
              <a
                href={item.button.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand-dark rounded-md transition-colors"
              >
                {item.button.label}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
