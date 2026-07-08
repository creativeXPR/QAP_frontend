import { useCallback, useMemo, useState } from "react";
import POTopNav from "../components/layout/POTopNav";
import AdminFooter from "../components/layout/AdminFooter";
import StatCard from "../components/dashboard/StatCard";
import DataTable from "../components/dashboard/DataTable";
import AsyncState from "../components/common/AsyncState";
import { useApiQuery } from "../hooks/useApiResource";
import { getListItems } from "../api/client";
import { students } from "../api/services";
import { mapFeedbackListForStaff } from "../lib/submissionMapper";
import {
  Search,
  FileText,
  Clock3,
  Bell,
  AlertTriangle,
  CheckCircle2,
} from "../lib/icons";

const CATEGORY_OPTIONS = ["All Categories", "Academic", "Welfare", "Facility", "Administrative", "Other"];
const STATUS_OPTIONS = ["All Status", "Pending", "Under Review", "Resolved"];

const FEEDBACK_COLUMNS = [
  { key: "title", label: "Feedback" },
  { key: "category", label: "Category", type: "badge" },
  { key: "urgency", label: "Urgency", type: "badge" },
  { key: "status", label: "Status", type: "badge" },
  { key: "submittedAt", label: "Submitted" },
];

function truncate(text, length = 70) {
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

export default function PODashboard() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");

  const {
    data: feedbackResponse,
    loading,
    error,
    refetch,
  } = useApiQuery(useCallback(() => students.feedback.list(), []));

  const feedbackItems = useMemo(
    () => mapFeedbackListForStaff(getListItems(feedbackResponse)),
    [feedbackResponse],
  );

  const stats = useMemo(
    () => ({
      total: feedbackItems.length,
      pending: feedbackItems.filter((i) => i.rawStatus === "pending").length,
      resolved: feedbackItems.filter((i) => i.rawStatus === "resolved").length,
      highUrgency: feedbackItems.filter((i) => i.rawUrgency === "high" || i.rawUrgency === "critical").length,
    }),
    [feedbackItems],
  );

  const filteredItems = useMemo(() => {
    return feedbackItems.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All Categories" || item.category === category;
      const matchesStatus = status === "All Status" || item.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [feedbackItems, search, category, status]);

  const tableRows = filteredItems.map((item) => ({
    ...item,
    title: truncate(item.title),
  }));

  const resetFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setStatus("All Status");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <POTopNav />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Principal Officer Dashboard
          </h1>
          <p className="text-xs text-gray-400">
            Quality Assurance Performance Overview
          </p>
        </div>

        {/* Overview stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={FileText} label="Total Complaints & Feedback" value={stats.total} />
          <StatCard icon={Clock3} label="Pending" value={stats.pending} />
          <StatCard icon={CheckCircle2} label="Resolved" value={stats.resolved} />
          <StatCard icon={AlertTriangle} label="High/Critical Urgency" value={stats.highUrgency} />
        </div>

        {/* Filters */}
        <section className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1">
            <Search size={14} />
            Data Filters & Controls
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Search and filter complaints/feedback by title, category and status
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-gray-400 mb-1.5">Search Keywords</p>
              <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2">
                <Search size={14} className="text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search feedback text..."
                  className="text-sm w-full outline-none placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1.5">Category Filter</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1.5">Status Filter</p>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={resetFilters}
              className="text-base text-brand border border-gray-200 px-4 py-2 rounded-[10px] hover:bg-gray-50"
            >
              Reset Filters
            </button>
          </div>
        </section>

        {/* Complaints & feedback overview */}
        <section>
          <h2 className="flex items-center gap-2 text-brand font-semibold text-base mb-1">
            <Bell size={16} />
            Complaints & Feedback Overview
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Read-only view of student complaints and feedback submitted platform-wide
          </p>

          <AsyncState
            loading={loading}
            error={error}
            empty={filteredItems.length === 0}
            onRetry={refetch}
            loadingLabel="Loading complaints & feedback..."
            emptyLabel={
              feedbackItems.length === 0
                ? "No complaints or feedback have been submitted yet."
                : "No records match your filters."
            }
          >
            <DataTable columns={FEEDBACK_COLUMNS} rows={tableRows} />
          </AsyncState>
        </section>
      </main>

      <AdminFooter />
    </div>
  );
}
