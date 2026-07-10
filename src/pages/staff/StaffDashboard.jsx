import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import StaffLayout from "../../components/staff/StaffLayout";
import AsyncState from "../../components/common/AsyncState";
import SearchFilterBar from "../../components/common/SearchFilterBar";

import {
  BarChart2,
  CheckCircle2,
  Hourglass,
  Loader2,
  BookOpen,
  FileText,
  Wrench,
  Home,
  UserCog,
  ShieldAlert,
  ClipboardList,
} from "../../lib/icons";

import { getListItems } from "../../api/client";
import { staffs, analytics } from "../../api/services";
import { mapSubmissionsFromApi } from "../../lib/submissionMapper";
import { useApiQuery } from "../../hooks/useApiResource";

const ALL = "all";

const STATUS_STYLES = {
  "In Review": "bg-gray-100 text-gray-500",
  Resolved: "bg-emerald-50 text-emerald-600",
};
const CATEGORY_ICONS = {
  General: BookOpen,
  Academics: BookOpen,
  Examination: FileText,
  Facilities: Wrench,
  Welfare: Home,
  Staff: UserCog,
  Security: ShieldAlert,
  Results: ClipboardList,
};
export default function StaffDashboard() {
  const navigate = useNavigate();

  /* ---------------- Reports ---------------- */

  const { data, loading, error, refetch } = useApiQuery(
    useCallback(() => staffs.feedbackTracking.list(), []),
  );

  /* ---------------- Updates ---------------- */

  const {
    data: updatesData,
    loading: updatesLoading,
    error: updatesError,
    refetch: refetchUpdates,
  } = useApiQuery(useCallback(() => analytics.updates.list(), []));

  /* ---------------- Reports ---------------- */

  const allReports = useMemo(
    () => mapSubmissionsFromApi(getListItems(data)),
    [data],
  );

  const recentReports = useMemo(() => allReports.slice(0, 3), [allReports]);

  /* ---------------- Updates ---------------- */

  const availableForms = useMemo(() => {
    return getListItems(updatesData).filter(
      (item) => item.forUser === "staff",
    );
  }, [updatesData]);

  /* ---------------- Available Forms filter ---------------- */

  const [formSearch, setFormSearch] = useState("");
  const [formCategoryFilter, setFormCategoryFilter] = useState(ALL);

  const formCategoryOptions = useMemo(() => {
    const unique = [...new Set(availableForms.map((f) => f.category).filter(Boolean))];
    return [ALL, ...unique];
  }, [availableForms]);

  const filteredAvailableForms = useMemo(() => {
    const query = formSearch.trim().toLowerCase();
    return availableForms.filter((form) => {
      const matchesSearch = !query || (form.title || "").toLowerCase().includes(query);
      const matchesCategory = formCategoryFilter === ALL || form.category === formCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [availableForms, formSearch, formCategoryFilter]);

  const stats = [
    {
      label: "Total Reports",
      value: allReports.length,
      icon: BarChart2,
    },
    {
      label: "Resolved",
      value: allReports.filter((item) => item.rawStatus === "resolved").length,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "In Review",
      value: allReports.filter((item) => item.rawStatus === "under_review")
        .length,
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
    <StaffLayout sessionLabel="This Semester">
      <div className="space-y-6">
        {/* Stats */}
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
        {/* Available Forms */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Available Forms
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Complete any active quality assurance forms assigned to staffs.
            </p>
          </div>

          <SearchFilterBar
            searchValue={formSearch}
            onSearchChange={setFormSearch}
            searchPlaceholder="Search by title..."
            filters={[
              {
                value: formCategoryFilter,
                onChange: setFormCategoryFilter,
                options: formCategoryOptions.map((opt) => ({
                  value: opt,
                  label: opt === ALL ? "All Categories" : opt,
                })),
              },
            ]}
          />

          <AsyncState
            loading={updatesLoading}
            error={updatesError}
            empty={filteredAvailableForms.length === 0}
            onRetry={refetchUpdates}
            loadingLabel="Loading available forms..."
            emptyLabel={
              availableForms.length === 0
                ? "There are currently no available forms."
                : "No results match your filters."
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filteredAvailableForms.map((form) => {
                const Icon = CATEGORY_ICONS[form.category] || BookOpen;

                return (
                  <div
                    key={form.id}
                    className="rounded-xl border border-gray-200 p-5 bg-white hover:border-brand transition"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand text-white mb-4">
                      <Icon size={18} />
                    </div>

                    <h3 className="text-base font-semibold text-gray-900">
                      {form.title}
                    </h3>

                    {form.description && (
                      <p className="mt-2 text-sm text-gray-500">
                        {form.description}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          form.classification === "Info"
                            ? "bg-blue-50 text-blue-600"
                            : form.classification === "Warning"
                              ? "bg-amber-50 text-amber-600"
                              : form.classification === "Critical"
                                ? "bg-red-50 text-red-600"
                                : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {form.classification}
                      </span>

                      <span className="text-xs text-gray-400">
                        {form.category}
                      </span>
                    </div>

                    {form.button?.url && (
                      <button
                        className="mt-5 w-full rounded-lg bg-brand text-white py-2 text-sm font-medium hover:bg-brand-dark transition"
                        onClick={() => {
                          const url = form.button.url;

                          if (url.startsWith("/")) {
                            navigate(url);
                            return;
                          }

                          window.open(url, "_blank", "noopener,noreferrer");
                        }}
                      >
                        {form.button.label || "Open Form"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </AsyncState>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <div className="mb-3 flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Recent Reports
              </p>

              <p className="text-xs text-gray-400">
                Overview of your submitted reports.
              </p>
            </div>

            <button
              onClick={() => navigate("/staff/reports/new")}
              className="rounded-[10px] bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
            >
              Submit Report
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            <AsyncState
              loading={loading}
              error={error}
              empty={recentReports.length === 0}
              onRetry={refetch}
              loadingLabel="Loading recent reports..."
              emptyLabel="No recent reports found."
            >
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between py-4 flex-wrap gap-2"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {report.title}
                    </p>

                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-600">
                        {report.category}
                      </span>

                      <span>{report.id}</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      STATUS_STYLES[report.status] ||
                      "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
              ))}
            </AsyncState>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
