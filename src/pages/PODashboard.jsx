import { useState } from "react";
import AdminTopNav from "../components/layout/AdminTopNav";
import Footer from "../components/layout/Footer";
import StatCard from "../components/dashboard/StatCard";
import DataTable from "../components/dashboard/DataTable";
import BarChartCard from "../components/dashboard/BarChartCard";
import LineChartCard from "../components/dashboard/LineChartCard";
import { FileText, TrendingUp, TrendingDown, Minus, RefreshCcw, Search } from "lucide-react";

const KEY_STATS = [
  { label: "Total Submissions", value: "1,247", trend: "+8% this month", icon: FileText },
  { label: "Completion Rate", value: "87.3%", trend: "+3.5% this month", icon: TrendingUp },
  { label: "Recent Updates", value: "1,247", trend: "+12.1% this month", icon: RefreshCcw },
];

const KPI_STATS = [
  { label: "Submission Completion Rate", value: "1,247", trend: "vs previous period", icon: FileText },
  { label: "Economic Productivity Score", value: "4,2/5.0", trend: "vs previous period", icon: TrendingUp },
  { label: "Administrative Service Rating", value: "3,8/5.0", trend: "vs previous period", icon: TrendingUp },
  { label: "Infrastructure Growth", value: "22.1%", trend: "+4.1%", icon: TrendingUp },
];

const SUBMISSIONS_BY_FACULTY = [
  { name: "Technology", total: 220, completed: 180, pending: 40 },
  { name: "Education", total: 190, completed: 150, pending: 40 },
  { name: "The Social Sciences", total: 200, completed: 160, pending: 40 },
  { name: "Clinical Sciences", total: 210, completed: 170, pending: 40 },
  { name: "College of Medicine", total: 230, completed: 190, pending: 40 },
  { name: "Science", total: 205, completed: 165, pending: 40 },
];

const DEPT_PERFORMANCE_COLUMNS = [
  { key: "dept", label: "Department / Unit" },
  { key: "submissions", label: "Submissions" },
  { key: "completionRate", label: "Completion Rate" },
  { key: "statusTrend", label: "Status & Trend" },
];

const DEPT_PERFORMANCE_ROWS = [
  { dept: "College of Medicine", submissions: 187, completionRate: 92.1, trend: "+5.2%", status: "Improving" },
  { dept: "Faculty of Engineering", submissions: 156, completionRate: 89, trend: "+3.1%", status: "Improving" },
  { dept: "Faculty of Science", submissions: 132, completionRate: 84.2, trend: "+6.5%", status: "Stable" },
  { dept: "Faculty of Arts", submissions: 187, completionRate: 85.2, trend: "+4.1%", status: "Improving" },
  { dept: "Faculty of The Social Sciences", submissions: 183, completionRate: 87.2, trend: "+6.3%", status: "Improving" },
  { dept: "Faculty of Law", submissions: 147, completionRate: 90.2, trend: "+4.3%", status: "Improving" },
  { dept: "Faculty of Education", submissions: 137, completionRate: 83.2, trend: "+4.3%", status: "Stable" },
  { dept: "Faculty of Clinical Sciences", submissions: 127, completionRate: 81.2, trend: "-1.3%", status: "Declining" },
];

const TREND_DATA = [
  { month: "Jan", academic: 65, administrative: 55, infrastructure: 40, overall: 60 },
  { month: "Feb", academic: 68, administrative: 58, infrastructure: 42, overall: 62 },
  { month: "Mar", academic: 72, administrative: 60, infrastructure: 45, overall: 65 },
  { month: "Apr", academic: 75, administrative: 63, infrastructure: 48, overall: 68 },
  { month: "May", academic: 80, administrative: 68, infrastructure: 50, overall: 72 },
  { month: "Jun", academic: 84, administrative: 72, infrastructure: 55, overall: 76 },
];

const TREND_SUMMARY = [
  { label: "Total Academic Growth", value: "+6.7%", bg: "bg-blue-50" },
  { label: "Overall Academic Growth", value: "+6.5%", bg: "bg-emerald-50" },
  { label: "Infrastructure Growth", value: "+3.7%", bg: "bg-amber-50" },
];

export default function PODashboard() {
  const [category, setCategory] = useState("All Categories");
  const [department, setDepartment] = useState("All Departments/Units");

  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminTopNav
        tabs={["Analyze Data", "Profile"]}
        activeTab=""
        portalLabel="Principal Officer"
      />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Principal Officer Dashboard
          </h1>
          <p className="text-xs text-gray-400">
            Quality assurance performance overview for your faculties
          </p>
        </div>

        {/* Top summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {KEY_STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Key performance indicators */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Key Performance Indicators
          </h2>
          <p className="text-xs text-gray-400 mb-3 -mt-2">
            Quality assurance performance metrics based on your role
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {KPI_STATS.map((s) => (
              <StatCard key={s.label} {...s} variant="overview" />
            ))}
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">
            Data Filters & Controls
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2">
              <Search size={14} className="text-gray-400" />
              <input
                placeholder="Search keywords..."
                className="text-sm w-full outline-none placeholder-gray-400"
              />
            </div>
            <select className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-500">
              <option>QA Signs</option>
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-500"
            >
              <option>All Categories</option>
              <option>Academic</option>
              <option>Administrative</option>
            </select>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="border border-brand rounded-md px-3 py-2 text-sm text-gray-700"
            >
              <option>All Departments/Units</option>
              <option>College of Medicine</option>
              <option>Faculty of Engineering</option>
            </select>
          </div>
          <div className="flex gap-3 mt-3">
            <button className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-50">
              Reset Filters
            </button>
            <button className="text-sm text-white bg-brand hover:bg-brand-dark px-4 py-2 rounded-md">
              Apply Filters
            </button>
          </div>
        </section>

        {/* Bar chart */}
        <BarChartCard
          title="Submissions by Faculties"
          subtitle="Distribution of quality assurance submissions across departments"
          data={SUBMISSIONS_BY_FACULTY}
        />

        {/* Department performance table */}
        <section className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            Departmental Performance Summary
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Detailed breakdown of submission statistics and completion rates
          </p>

          <DataTable
            columns={DEPT_PERFORMANCE_COLUMNS}
            rows={DEPT_PERFORMANCE_ROWS.map((r) => {
              const barColor =
                r.completionRate >= 90
                  ? "bg-emerald-500"
                  : r.completionRate >= 85
                  ? "bg-blue-600"
                  : "bg-amber-500";

              const STATUS_STYLES = {
                Improving: {
                  Icon: TrendingUp,
                  className: "text-emerald-600 border-emerald-200 bg-emerald-50",
                },
                Stable: {
                  Icon: Minus,
                  className: "text-amber-600 border-amber-200 bg-amber-50",
                },
                Declining: {
                  Icon: TrendingDown,
                  className: "text-red-500 border-red-200 bg-red-50",
                },
              };
              const { Icon: StatusIcon, className: statusClass } =
                STATUS_STYLES[r.status] || STATUS_STYLES.Stable;

              return {
                ...r,
                completionRate: (
                  <div className="min-w-[110px]">
                    <p className="text-sm text-gray-700 mb-1">
                      {r.completionRate}%
                    </p>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor}`}
                        style={{ width: `${r.completionRate}%` }}
                      />
                    </div>
                  </div>
                ),
                statusTrend: (
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${statusClass}`}
                    >
                      <StatusIcon size={12} />
                      {r.status}
                    </span>
                    <span
                      className={
                        r.status === "Declining"
                          ? "text-red-500 text-sm"
                          : "text-emerald-600 text-sm"
                      }
                    >
                      {r.trend}
                    </span>
                  </div>
                ),
              };
            })}
          />

          <div className="flex items-center justify-between mt-4 text-sm">
            <p className="text-gray-400">
              Showing {DEPT_PERFORMANCE_ROWS.length} Departments
            </p>
            <div className="flex gap-2">
              <button className="border border-gray-200 text-gray-500 px-4 py-1.5 rounded-md hover:bg-gray-50">
                Previous
              </button>
              <button className="border border-gray-200 text-gray-500 px-4 py-1.5 rounded-md hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </section>

        {/* Performance trend line chart */}
        <LineChartCard
          title="Performance Trend Analysis"
          subtitle="Quality assurance metrics over time by category"
          data={TREND_DATA}
          summary={TREND_SUMMARY}
        />
      </main>

      <Footer />
    </div>
  );
}