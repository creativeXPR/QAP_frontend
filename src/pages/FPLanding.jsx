import { useCallback, useMemo } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AsyncState from "../components/common/AsyncState";
import FeedbackCaseCard from "../components/dashboard/FeedbackCaseCard";
import { useApiQuery } from "../hooks/useApiResource";
import { getListItems, replaceListItem } from "../api/client";
import { students } from "../api/services";
import { mapFeedbackListForStaff } from "../lib/submissionMapper";
import {
  BarChart2,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Menu,
  BookOpen,
  Activity,
  Headphones,
  ShieldAlert,
  Bell,
} from "../lib/icons";

// =====================================================================
// PLACEHOLDER DATA — mirrors the reference "home" template's #forms and
// #updates sections (Firestore `forms` / `updates` collections in the
// old vanilla-JS app). No equivalent resource exists in
// api/services.js for Focal Persons yet.
//
// Once a real endpoint exists, replace with something like:
//
//   const { data: formsResponse, loading: formsLoading } = useApiQuery(
//     useCallback(() => students.forms.list(), [])  // or wherever this
//   );                                              // ends up living
//   const forms = getListItems(formsResponse);
//
// Same pattern for `updates`.
// =====================================================================

const PLACEHOLDER_FORMS = [
  { id: "form-1", icon: BookOpen, title: "Examination Administration Quality", dueDate: "January 15, 2026" },
  { id: "form-2", icon: Activity, title: "Daily Lecture Monitoring Form", dueDate: "January 15, 2026" },
  { id: "form-3", icon: Headphones, title: "Service Delivery & Complaint", dueDate: "January 15, 2026" },
  { id: "form-4", icon: ShieldAlert, title: "Health Facility Issue", dueDate: "January 15, 2026" },
];

const PLACEHOLDER_UPDATES = [
  {
    id: "update-1",
    type: "Academic",
    title: "Evaluation of Staff Duty Efficiency",
    tag: "Form",
    dueDate: "January 18, 2026",
  },
];

const STATUS_STYLES = {
  Pending: "bg-amber-50 text-amber-600",
  "Under Review": "bg-gray-100 text-gray-500",
  Resolved: "bg-emerald-50 text-emerald-600",
};

export default function FPLanding() {
  const {
    data: feedbackResponse,
    loading,
    error,
    refetch,
    setData: setFeedbackResponse,
  } = useApiQuery(useCallback(() => students.feedback.list(), []));

  const cases = useMemo(
    () => mapFeedbackListForStaff(getListItems(feedbackResponse)),
    [feedbackResponse],
  );

  const stats = useMemo(
    () => [
      { label: "Total Cases", value: cases.length, icon: BarChart2 },
      {
        label: "Resolved",
        value: cases.filter((c) => c.rawStatus === "resolved").length,
        icon: CheckCircle2,
        iconBg: "bg-emerald-50 text-emerald-600",
      },
      {
        label: "Pending",
        value: cases.filter((c) => c.rawStatus === "pending").length,
        icon: Clock3,
        iconBg: "bg-amber-50 text-amber-600",
      },
      {
        label: "High/Critical Urgency",
        value: cases.filter((c) => c.rawUrgency === "high" || c.rawUrgency === "critical").length,
        icon: AlertTriangle,
        iconBg: "bg-red-50 text-red-500",
      },
    ],
    [cases],
  );

  const handleCaseUpdated = (updated) => {
    setFeedbackResponse((prev) => replaceListItem(prev, updated.id, updated));
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="max-w-3xl mx-auto text-center px-4 pt-14 pb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Welcome to the Quality Assurance Platform
        </h1>
        <p className="text-gray-500 mb-6 max-w-xl mx-auto">
          Access all assigned quality assurance evaluations, track submission
          status, and meet deadlines with ease.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button className="bg-brand hover:bg-brand-dark text-white text-base font-medium px-5 py-2.5 rounded-[10px]">
            Start Submission
          </button>
          <button className="border border-gray-300 text-gray-700 text-base font-medium px-5 py-2.5 rounded-[10px] hover:bg-gray-50">
            View My Profile
          </button>
        </div>
      </section>

      {/* Hero dashboard preview */}
      <section className="max-w-4xl mx-auto px-4 mb-10">
        <img
          src="/dashboard-preview.png"
          alt="Quality Assurance dashboard preview"
          className="w-full rounded-xl shadow-lg border border-gray-100"
        />
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 space-y-6">
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

        {/* Updates */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1">
            <Bell size={15} />
            Updates
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Select a view, to view an update
          </p>

          {PLACEHOLDER_UPDATES.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              No updates available at the moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PLACEHOLDER_UPDATES.map((update) => (
                <div
                  key={update.id}
                  className="border border-gray-100 rounded-lg p-4 flex flex-col"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand bg-brand/5 px-2 py-1 rounded-full mb-3 w-fit">
                    <BookOpen size={12} />
                    {update.type}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 mb-2 flex-1">
                    {update.title}
                  </p>
                  <span className="inline-block text-[11px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full mb-3 w-fit">
                    {update.tag}
                  </span>
                  <p className="text-xs text-gray-400 mb-4">Due: {update.dueDate}</p>
                  <button className="text-sm font-medium text-gray-700 border border-gray-200 rounded-[10px] py-2 hover:bg-gray-50">
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Forms */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            Available Forms
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Select a form to begin or continue a submission.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLACEHOLDER_FORMS.map(({ id, icon: Icon, title, dueDate }) => (
              <div
                key={id}
                className="border border-gray-100 rounded-lg p-4 flex flex-col"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-md bg-brand text-white mb-3">
                  <Icon size={16} />
                </span>
                <p className="text-sm font-semibold text-gray-900 mb-2 flex-1">
                  {title}
                </p>
                <p className="text-xs text-gray-400 mb-4">Due: {dueDate}</p>
                <button className="text-sm font-medium text-gray-700 border border-gray-200 rounded-[10px] py-2 hover:bg-gray-50">
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}