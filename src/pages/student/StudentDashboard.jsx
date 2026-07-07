import { useNavigate } from "react-router-dom";
import StudentSidebar from "../../components/student/StudentSidebar";
import StudentTopBar from "../../components/student/StudentTopBar";
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
} from "lucide-react";

const STATS = [
  { label: "Total Reports", value: "16", icon: BarChart2 },
  { label: "Resolved", value: "10", icon: CheckCircle2, iconBg: "bg-emerald-50 text-emerald-600" },
  { label: "In Review", value: "1", icon: Hourglass, iconBg: "bg-amber-50 text-amber-600" },
  { label: "Pending", value: "3", icon: Loader2, iconBg: "bg-gray-100 text-gray-500" },
];

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

const RECENT_REPORTS = [
  {
    title: "Unnanounced Change of Exam Venue for Phy 101",
    category: "Academics",
    id: "UI 2026-QAP-001",
    status: "In Review",
  },
  {
    title: "Broken Water Supply in Queen Elizabeth Hall",
    category: "Hostel/Welfare",
    id: "UI 2026-QAP-002",
    status: "Resolved",
  },
  {
    title: "Missing Results for CSC 302 - Database Issue",
    category: "Examinations",
    id: "UI 2026-QAP-003",
    status: "In Review",
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <StudentSidebar />

      <div className="flex-1">
        <StudentTopBar sessionLabel="This Semester" />

        <main className="px-4 md:px-8 py-6 space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s) => (
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
                  Recent Reports
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
              {RECENT_REPORTS.map((r) => (
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}