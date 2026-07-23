import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import StudentLayout from "../../components/student/StudentLayout";
import AsyncState from "../../components/common/AsyncState";
import SearchFilterBar from "../../components/common/SearchFilterBar";
import KPICard from "../../components/dashboard/KPICard";
import CollapsibleSection from "../../components/dashboard/CollapsibleSection";

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
  Search,
} from "../../lib/icons";

import { getListItems } from "../../api/client";
import { students, analytics } from "../../api/services";
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
export default function StudentDashboard() {
  const navigate = useNavigate();

  /* ---------------- Reports ---------------- */

  const { data, loading, error, refetch } = useApiQuery(
    useCallback(() => students.feedbackTracking.list(), []),
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
      (item) => item.forUser === "student",
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

  /* ---------------- KPIs ---------------- */

  const [kpisOpen, setKpisOpen] = useState(true);

  const {
    data: kpiResponse,
    loading: kpisLoading,
    error: kpisError,
    refetch: refetchKpis,
  } = useApiQuery(useCallback(() => analytics.kpis.list(), []));

  const kpis = useMemo(() => {
    return getListItems(kpiResponse).map((item) => {
      const metrics = item.metrics ?? {};
      const firstMetric = Object.values(metrics)[0];

      return {
        id: item.id,
        title: item.title,
        category: "General",
        status: "stable",
        value: firstMetric ?? "--",
        changePercent: "",
        changePeriod: "",
        analysisText: item.description,
        embedLink: item.embedlink,
        metrics,
      };
    });
  }, [kpiResponse]);

  const kpiCategoryOptions = useMemo(() => {
    const unique = [...new Set(kpis.map((k) => k.category).filter(Boolean))];
    return [ALL, ...unique];
  }, [kpis]);

  const [kpiSearch, setKpiSearch] = useState("");
  const [kpiCategoryFilter, setKpiCategoryFilter] = useState(ALL);
  const [kpiStatusFilter, setKpiStatusFilter] = useState(ALL);

  const filteredKpis = useMemo(() => {
    return kpis.filter((kpi) => {
      const matchesSearch =
        !kpiSearch ||
        kpi.title.toLowerCase().includes(kpiSearch.toLowerCase()) ||
        (kpi.analysisText ?? "").toLowerCase().includes(kpiSearch.toLowerCase());

      const matchesCategory = kpiCategoryFilter === ALL || kpi.category === kpiCategoryFilter;

      const matchesStatus = kpiStatusFilter === ALL || kpi.status === kpiStatusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [kpis, kpiSearch, kpiCategoryFilter, kpiStatusFilter]);

  const resetKpiFilters = () => {
    setKpiSearch("");
    setKpiCategoryFilter(ALL);
    setKpiStatusFilter(ALL);
  };

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
    <StudentLayout sessionLabel="This Semester">
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
              Complete any active quality assurance forms assigned to students.
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

        {/* KPIs (collapsible, each card independently collapsible) */}
        <CollapsibleSection
          icon={BarChart2}
          title="KPIs"
          subtitle="KPI cards with expandable descriptions and charts"
          open={kpisOpen}
          onToggle={setKpisOpen}
          filterNode={
            <section className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1">
                <Search size={14} />
                Data Filters & Controls
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Search and filter KPIs by title, category and status
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Search Keywords</p>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2">
                    <Search size={14} className="text-gray-400" />
                    <input
                      value={kpiSearch}
                      onChange={(e) => setKpiSearch(e.target.value)}
                      placeholder="Search KPI title..."
                      className="text-sm w-full outline-none placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Category Filter</p>
                  <select
                    value={kpiCategoryFilter}
                    onChange={(e) => setKpiCategoryFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 capitalize"
                  >
                    {kpiCategoryOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === ALL ? "All Categories" : opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Status Filter</p>
                  <select
                    value={kpiStatusFilter}
                    onChange={(e) => setKpiStatusFilter(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600"
                  >
                    <option value="all">All Status</option>
                    <option value="improving">Improving</option>
                    <option value="stable">Stable</option>
                    <option value="declining">Declining</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={resetKpiFilters}
                  className="text-base text-brand border border-gray-200 px-4 py-2 rounded-[10px] hover:bg-gray-50"
                >
                  Reset Filters
                </button>
                <button className="text-base text-white bg-brand hover:bg-brand-dark px-4 py-2 rounded-[10px]">
                  Apply Filters
                </button>
              </div>
            </section>
          }
        >
          <AsyncState
            loading={kpisLoading}
            error={kpisError}
            empty={filteredKpis.length === 0}
            onRetry={refetchKpis}
            loadingLabel="Loading KPIs..."
            emptyLabel={kpis.length === 0 ? "No KPIs found." : "No results match your filters."}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredKpis.map((kpi) => (
                <KPICard key={kpi.id} kpi={kpi} />
              ))}
            </div>
          </AsyncState>
        </CollapsibleSection>

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
              onClick={() => navigate("/student/reports/new")}
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
    </StudentLayout>
  );
}
