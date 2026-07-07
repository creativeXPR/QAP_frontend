import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

const COLORS = {
  total: "#22258F",
  completed: "#10B981",
  pending: "#F59E0B",
};

export default function BarChartCard({ title, subtitle, data }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white shadow-sm p-4">
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mb-4">{subtitle}</p>}

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={50}
            />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="total" name="Total" fill={COLORS.total} radius={[3, 3, 0, 0]} />
            <Bar dataKey="completed" name="Completed" fill={COLORS.completed} radius={[3, 3, 0, 0]} />
            <Bar dataKey="pending" name="Pending" fill={COLORS.pending} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}