import { Pencil, Trash2, Eye } from "../../lib/icons";

const BADGE_STYLES = {
  Active: "bg-emerald-50 text-emerald-600",
  Draft: "bg-gray-100 text-gray-500",
  Academic: "bg-blue-50 text-blue-600",
  Administrative: "bg-purple-50 text-purple-600",
  Infrastructure: "bg-amber-50 text-amber-600",
  Urgent: "bg-red-50 text-red-500",
  Announcement: "bg-blue-50 text-blue-600",
  "Edit & Submit": "bg-blue-50 text-blue-600",
  "View Only": "bg-gray-100 text-gray-500",
  "Academic View": "bg-blue-50 text-blue-600",
  "University-wide": "bg-purple-50 text-purple-600",
  Pending: "bg-amber-50 text-amber-600",
  "Under Review": "bg-blue-50 text-blue-600",
  Resolved: "bg-emerald-50 text-emerald-600",
  Critical: "bg-red-50 text-red-500",
  High: "bg-red-50 text-red-500",
  Normal: "bg-gray-100 text-gray-500",
};

function Badge({ value }) {
  if (!value) return null;
  return (
    <span
      className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
        BADGE_STYLES[value] || "bg-gray-50 text-gray-500"
      }`}
    >
      {value}
    </span>
  );
}

/**
 * columns: [{ key, label, type: 'text' | 'badge' }]
 * rows: array of objects keyed by column key
 * actions: array of 'view' | 'edit' | 'delete'
 */
export default function DataTable({ columns, rows, actions = [] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2.5 font-medium whitespace-nowrap">
                {col.label}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-4 py-2.5 font-medium text-right">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="hover:bg-gray-50/50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {col.type === "badge" ? (
                    <Badge value={row[col.key]} />
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3 text-gray-400">
                    {actions.includes("view") && (
                      <button className="hover:text-brand" aria-label="View">
                        <Eye size={15} />
                      </button>
                    )}
                    {actions.includes("edit") && (
                      <button className="hover:text-brand" aria-label="Edit">
                        <Pencil size={15} />
                      </button>
                    )}
                    {actions.includes("delete") && (
                      <button className="hover:text-red-500" aria-label="Delete">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}