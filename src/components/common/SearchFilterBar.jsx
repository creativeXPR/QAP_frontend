import { Search, ChevronDown } from "../../lib/icons";

/**
 * Reusable search + select filter row, styled to match the pattern
 * already established in StudentSubmissionsList.jsx / PODashboard.jsx.
 *
 * `filters` is an array of { value, onChange, options: [{value,label}] },
 * each rendered as its own <select> with a right-aligned chevron.
 */
export default function SearchFilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  className = "",
}) {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 mb-4 ${className}`}>
      <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 flex-1 min-w-0">
        <Search size={15} className="text-gray-400 shrink-0" />
        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="text-sm w-full min-w-0 outline-none placeholder-gray-400"
        />
      </div>

      {filters.map((filter, index) => (
        <div key={index} className="relative sm:w-48 shrink-0">
          <select
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="w-full appearance-none border border-gray-200 rounded-md pl-3 pr-8 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      ))}
    </div>
  );
}
