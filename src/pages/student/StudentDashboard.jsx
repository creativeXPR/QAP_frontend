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
  Menu,
  BookOpen,
  Activity,
  Headphones,
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

// TODO: no backend endpoint currently exists for "Available Forms" —
// no forms resource is registered in api/services.js. Using sample
// data as a placeholder until a real forms.list()-style endpoint
// exists to swap this out for.
const AVAILABLE_FORMS = [
  {
    icon: BookOpen,
    title: "Examination Administration Quality",
    dueDate: "January 15, 2026",
  },
  {
    icon: Activity,
    title: "Daily Lecture Monitoring Form",
    dueDate: "January 15, 2026",
  },
  {
    icon: Headphones,
    title: "Service Delivery & Complaint",
    dueDate: "January 15, 2026",
  },
  {
    icon: ShieldAlert,
    title: "Health Facility Issue",
    dueDate: "January 15, 2026",
  },
];


export default function StudentDashboard() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useApiQuery(
    useCallback(() => students.feedbackTracking.list(), []),
  );

  // All of the student's reports — stats below must reflect this full
  // list, not just the handful shown in "Recent Reports".
  const allReports = useMemo(() => mapSubmissionsFromApi(getListItems(data)), [data]);
  const recentReports = allReports.slice(0, 3);

  const stats = [
    { label: "Total Reports", value: allReports.length, icon: BarChart2 },
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

        {/* Available Forms */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            Available Forms
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Select from the active forms below to submit your feedback,
            course evaluations, or departmental assessments
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AVAILABLE_FORMS.map(({ icon: Icon, title, dueDate }) => (
              <div
                key={title}
                className="border border-gray-100 rounded-lg p-4 flex flex-col"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-md bg-brand text-white mb-3">
                  <Icon size={16} />
                </span>
                <p className="text-sm font-semibold text-gray-900 mb-2 flex-1">
                  {title}
                </p>
                <p className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                  Due: {dueDate}
                </p>
                <button
                  onClick={() => navigate("/student/reports")}
                  className="text-sm font-medium text-gray-700 border border-gray-200 rounded-[10px] py-2 hover:bg-gray-50"
                >
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>


        {/* Recent reports */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Recent Reports
              </p>
              <p className="text-xs text-gray-400">
                Overview of your submitted reports
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 border border-gray-200 px-4 py-2 rounded-[10px] hover:bg-gray-50"
              >
                <Menu size={15} />
                Filters
              </button>
              <button
                onClick={() => navigate("/student/reports/new")}
                className="text-sm font-medium text-white bg-brand hover:bg-brand-dark px-4 py-2 rounded-[10px]"
              >
                Submit Report
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