import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

const LINE_COLORS = {
  academic: "#22258F",
  administrative: "#10B981",
  infrastructure: "#F59E0B",
  overall: "#6366F1",
};

export default function LineChartCard({ title, subtitle, data, summary }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white shadow-sm p-4">
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mb-4">{subtitle}</p>}

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="academic" name="Academic" stroke={LINE_COLORS.academic} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="administrative" name="Administrative" stroke={LINE_COLORS.administrative} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="infrastructure" name="Infrastructure" stroke={LINE_COLORS.infrastructure} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="overall" name="Overall" stroke={LINE_COLORS.overall} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {summary && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {summary.map((s) => (
            <div key={s.label} className={`rounded-md p-3 ${s.bg}`}>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-sm font-semibold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}