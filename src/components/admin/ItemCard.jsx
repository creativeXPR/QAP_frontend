import { FileText, Calendar, Pencil, Trash2 } from "../../lib/icons";

export default function ItemCard({ title, subtitle, badge, badgeColor = "bg-gray-100 text-gray-600", meta, icon: Icon = FileText, onEdit, onDelete }) {
  return (
    <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow bg-white mb-3">
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
      {(onEdit || onDelete) && (
        <div className="flex items-center gap-1 shrink-0">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-brand hover:bg-brand/5 rounded transition-colors"
              title="Edit"
            >
              <Pencil size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
