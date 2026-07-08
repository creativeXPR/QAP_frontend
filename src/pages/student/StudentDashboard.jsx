import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/student/StudentLayout";
import AsyncState from "../../components/common/AsyncState";
import {
  BarChart2,
  CheckCircle2,
  Hourglass,
  Loader2,
  FileText,
  Home,
  Wrench,
  UserCog,
  Clock3,
  ShieldAlert,
  ClipboardList,
} from "../../lib/icons";
import { getListItems } from "../../api/client";
import { students } from "../../api/services";
import { mapSubmissionsFromApi } from "../../lib/submissionMapper";
import { useApiQuery } from "../../hooks/useApiResource";

const CATEGORIES = [
  { label: "Academics", icon: FileText },
  { label: "Hostel/Welfare", icon: Home },
  { label: "Facilities", icon: Wrench },
  { label: "Staff Conduct", icon: UserCog },
  { label: "Admin Delays", icon: Clock3 },
  { label: "Safety/Security", icon: ShieldAlert },
  { label: "Results", icon: ClipboardList },
];

const STATUS_STYLES = {
  "In Review": "bg-gray-100 text-gray-500",
  Resolved: "bg-emerald-50 text-emerald-600",
};


export default function StudentDashboard() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useApiQuery(
    useCallback(() => students.feedbackTracking.list(), []),
  );

  // All of the student's reports — stats below must reflect this full
  // list, not just the handful shown in "Recent Submissions".
  const allReports = useMemo(() => mapSubmissionsFromApi(getListItems(data)), [data]);
  const recentReports = allReports.slice(0, 3);

  const stats = [
    { label: "Total Submissions", value: allReports.length, icon: BarChart2 },
    {
      label: "Resolved",
      value: allReports.filter((item) => item.rawStatus === "resolved").length,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "In Review",
      value: allReports.filter((item) => item.rawStatus === "under_review").length,
      icon: Hourglass,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      label: "Pending",
      value: allReports.filter((item) => item.rawStatus === "pending").length,
      icon: Loader2,
      iconBg: "bg-gray-100 text-gray-500",
    },
  ];

  return (
    <StudentLayout sessionLabel="This Semester">
      <div className="space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-lg border border-gray-100 shadow-sm p-4"
            >
              <span
                className={`flex items-center justify-center w-9 h-9 rounded-md mb-4 ${
                  s.iconBg || "bg-gray-50 text-gray-500"
                }`}
              >
                <s.icon size={16} />
              </span>
              <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Report categories */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">
            Report Categories
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(({ label, icon: Icon }) => (
              <button
                key={label}
                className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-full px-3 py-1.5 hover:border-brand hover:text-brand"
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent reports */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Recent Submissions
              </p>
              <p className="text-xs text-gray-400">
                Overview of your submitted reports
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/student/reports/new")}
                className="text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50"
              >
                Submit Report
              </button>
              <button
                onClick={() => navigate("/student/reports")}
                className="text-sm font-medium text-white bg-brand hover:bg-brand-dark px-4 py-2 rounded-full"
              >
                Track Cases
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100 mt-3">
            <AsyncState
              loading={loading}
              error={error}
              empty={recentReports.length === 0}
              onRetry={refetch}
              loadingLabel="Loading recent reports..."
              emptyLabel="No recent reports found."
            >
              {recentReports.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between py-4 flex-wrap gap-2"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      {r.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="text-emerald-600 border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {r.category}
                      </span>
                      <span>{r.id}</span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                      STATUS_STYLES[r.status] || "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {r.status === "In Review" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    )}
                    {r.status}
                  </span>
                </div>
              ))}
            </AsyncState>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
