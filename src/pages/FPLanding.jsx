import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AsyncState from "../components/common/AsyncState";
import SearchFilterBar from "../components/common/SearchFilterBar";
import StatCard from "../components/dashboard/StatCard";
import { useApiQuery } from "../hooks/useApiResource";
import { getListItems, replaceListItem } from "../api/client";
import { students, analytics } from "../api/services";
import {
  BarChart2,
  BookOpen,
  Bell,
  LayoutDashboard,
  PlusSquare,
  Send,
  User,
  LogOut,
  ChevronDown,
  Search,
  FileText,
  Clock3,
  TrendingUp,
  TrendingDown,
  Minus,
} from "../lib/icons";

const ALL = "all";

// Status badge helper for KPI Cards
const STATUS_STYLES = {
  improving: {
    icon: TrendingUp,
    label: "Improving",
    className: "text-emerald-600 bg-emerald-50",
  },
  stable: {
    icon: Minus,
    label: "Stable",
    className: "text-amber-600 bg-amber-50",
  },
  declining: {
    icon: TrendingDown,
    label: "Declining",
    className: "text-red-500 bg-red-50",
  },
};

function KPICard({ kpi }) {
  const [open, setOpen] = useState(false);
  const statusKey = (kpi.status || "stable").toLowerCase();
  const {
    icon: StatusIcon,
    label,
    className: statusClass,
  } = STATUS_STYLES[statusKey] || STATUS_STYLES.stable;

  return (
    <div className="border border-gray-100 rounded-xl bg-white overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-gray-50/50 transition-colors"
      >
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{kpi.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5 capitalize">
            {kpi.category}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${statusClass}`}
          >
            <StatusIcon size={12} />
            {label}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-3">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-semibold text-brand">
              {kpi.value}
            </span>
            {kpi.changePercent && (
              <span className="text-xs text-gray-400">
                {kpi.changePercent} {kpi.changePeriod ? `(${kpi.changePeriod})` : ""}
              </span>
            )}
          </div>
          {kpi.analysisText && (
            <p className="text-sm text-gray-500 leading-relaxed">
              {kpi.analysisText}
            </p>
          )}
          {Object.keys(kpi.metrics || {}).length > 0 && (
            <div className="space-y-2 mt-3">
              {Object.entries(kpi.metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="capitalize text-gray-500">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="font-semibold text-brand">{value}</span>
                </div>
              ))}
            </div>
          )}

          {kpi.embedLink && (
            <iframe
              src={kpi.embedLink}
              title={kpi.title}
              className="w-full h-96 rounded-lg border mt-4"
              loading="lazy"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function FPLanding() {
  const navigate = useNavigate();

  // Sidebar navigation state: 'Dashboard' | 'KPIs' | 'Updates' | 'Submissions' | 'Notifications' | 'Profile'
  const [activeSidebarNav, setActiveSidebarNav] = useState("Dashboard");

  /* ---------------- Live API Hooks ---------------- */
  const {
    data: feedbackResponse,
    setData: setFeedbackResponse,
  } = useApiQuery(useCallback(() => students.feedback.list(), []));

  const {
    data: updatesResponse,
    loading: updatesLoading,
    error: updatesError,
    refetch: refetchUpdates,
  } = useApiQuery(useCallback(() => analytics.updates.list(), []));

  const {
    data: kpiResponse,
    loading: kpisLoading,
    error: kpisError,
    refetch: refetchKpis,
  } = useApiQuery(useCallback(() => analytics.kpis.list(), []));

  // Focal person filtered updates
  const fpUpdates = useMemo(
    () =>
      getListItems(updatesResponse).filter(
        (item) => item.forUser === "focal_person" || !item.forUser
      ),
    [updatesResponse]
  );

  // Mapped KPI list from backend
  const kpis = useMemo(() => {
    return getListItems(kpiResponse).map((item) => {
      const metrics = item.metrics ?? {};
      const firstMetric = Object.values(metrics)[0];

      return {
        id: item.id,
        title: item.title,
        category: item.category || "General",
        status: item.status || "stable",
        value: firstMetric ?? "--",
        changePercent: item.changePercent || "",
        changePeriod: item.changePeriod || "",
        analysisText: item.description,
        embedLink: item.embedlink,
        metrics,
      };
    });
  }, [kpiResponse]);

  /* ---------------- Updates Filter & State ---------------- */
  const [updateSearch, setUpdateSearch] = useState("");
  const [updateCategoryFilter, setUpdateCategoryFilter] = useState(ALL);

  const updateCategoryOptions = useMemo(() => {
    const unique = [
      ...new Set(fpUpdates.map((u) => u.category).filter(Boolean)),
    ];
    return [ALL, ...unique];
  }, [fpUpdates]);

  const filteredFpUpdates = useMemo(() => {
    const query = updateSearch.trim().toLowerCase();
    return fpUpdates.filter((u) => {
      const matchesSearch =
        !query || (u.title || "").toLowerCase().includes(query);
      const matchesCategory =
        updateCategoryFilter === ALL || u.category === updateCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [fpUpdates, updateSearch, updateCategoryFilter]);

  /* ---------------- KPIs Filter & State ---------------- */
  const [kpiSearch, setKpiSearch] = useState("");
  const [kpiCategory, setKpiCategory] = useState(ALL);
  const [kpiStatus, setKpiStatus] = useState(ALL);

  const kpiCategoryOptions = useMemo(() => {
    const unique = [...new Set(kpis.map((k) => k.category).filter(Boolean))];
    return [ALL, ...unique];
  }, [kpis]);

  const filteredKpis = useMemo(() => {
    return kpis.filter((kpi) => {
      const matchesSearch =
        !kpiSearch ||
        kpi.title.toLowerCase().includes(kpiSearch.toLowerCase()) ||
        (kpi.analysisText ?? "").toLowerCase().includes(kpiSearch.toLowerCase());

      const matchesCategory =
        kpiCategory === ALL || kpi.category === kpiCategory;
      const matchesStatus = kpiStatus === ALL || kpi.status === kpiStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [kpis, kpiSearch, kpiCategory, kpiStatus]);

  const resetKpiFilters = () => {
    setKpiSearch("");
    setKpiCategory(ALL);
    setKpiStatus(ALL);
  };

  // Sidebar Links Structure
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "KPIs", icon: BarChart2, badge: kpis.length },
    { label: "Updates", icon: Bell, badge: fpUpdates.length },
    // { label: "Submissions", icon: Send },
    // { label: "Notifications", icon: PlusSquare },
    // { label: "Profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50/60 text-gray-800 font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Header & Institution Logo */}
          <div className="flex items-start gap-3 mb-8 px-2 pt-1">
            <img
              src="/logo.png"
              alt="UI Logo"
              className="w-8 h-8 object-contain shrink-0"
            />
            <div>
              <h2 className="text-[11px] font-bold text-indigo-950 tracking-tight leading-tight">
                DIRECTORATE OF QUALITY ASSURANCE
              </h2>
              <p className="text-[9px] text-gray-400 mt-0.5 leading-tight">
                Quality Assurance...doing the right things right every time
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSidebarNav === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveSidebarNav(item.label)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-50/80 text-indigo-700 font-semibold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={isActive ? "text-indigo-700" : "text-gray-400"}
                    />
                    {item.label}
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Badge & Footer */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
              fp
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">
                Focal Person
              </p>
              <span className="inline-block text-[10px] font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                Focal Person
              </span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-medium py-2 rounded-xl transition-colors">
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Welcome Back, Focal Person 👋
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">July, 23rd 2026</p>
          </div>

          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-1.5 bg-white text-xs text-gray-600 shadow-sm cursor-pointer hover:bg-gray-50">
            <span>2025/2026</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </header>

        {/* View Main Content */}
        <main className="p-8 max-w-7xl w-full">
          {/* VIEW: DASHBOARD TAB */}
          {activeSidebarNav === "Dashboard" && (
            <div className="space-y-8">
              {/* Main Hero Section */}
              <section className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Welcome to the Quality Assurance Platform
                </h1>
                <p className="text-gray-500 mb-6 max-w-xl mx-auto text-sm">
                  Access all assigned quality assurance evaluations, track submission
                  status, and meet deadlines with ease.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveSidebarNav("Updates")}
                    className="bg-brand hover:bg-brand-dark text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                  >
                    Start Submission
                  </button>
                  <Link
                    to="/profile/me"
                    className="border border-gray-300 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    View My Profile
                  </Link>
                </div>
              </section>

              {/* Dashboard Preview Image */}
              <section className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <img
                  src="/dashboard-preview.png"
                  alt="Quality Assurance dashboard preview"
                  className="w-full rounded-xl"
                />
              </section>

              {/* Stat Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                  icon={FileText}
                  label="Total KPIs"
                  value={kpis.length}
                />
                <StatCard
                  icon={Clock3}
                  label="Total Assigned Updates"
                  value={fpUpdates.length}
                />
              </div>
            </div>
          )}

          {/* VIEW: KPIS TAB */}
          {activeSidebarNav === "KPIs" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Key Performance Indicators</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Track performance evaluations and progress metrics
                </p>
              </div>

              {/* Filter Section */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1">
                  <Search size={14} />
                  Data Filters & Controls
                </h2>
                <p className="text-xs text-gray-400 mb-4">
                  Search and filter KPIs by title, category, and status
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">Search Keywords</p>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
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
                      value={kpiCategory}
                      onChange={(e) => setKpiCategory(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 capitalize outline-none"
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
                      value={kpiStatus}
                      onChange={(e) => setKpiStatus(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none"
                    >
                      <option value={ALL}>All Status</option>
                      <option value="improving">Improving</option>
                      <option value="stable">Stable</option>
                      <option value="declining">Declining</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={resetKpiFilters}
                    className="text-xs font-semibold text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </section>

              {/* KPI List Grid */}
              <AsyncState
                loading={kpisLoading}
                error={kpisError}
                empty={filteredKpis.length === 0}
                onRetry={refetchKpis}
                loadingLabel="Loading KPIs..."
                emptyLabel={
                  kpis.length === 0
                    ? "No KPIs found."
                    : "No results match your filters."
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredKpis.map((kpi) => (
                    <KPICard key={kpi.id} kpi={kpi} />
                  ))}
                </div>
              </AsyncState>
            </div>
          )}

          {/* VIEW: UPDATES TAB */}
          {activeSidebarNav === "Updates" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Assigned Updates & Forms</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Quality assurance updates and forms assigned to focal persons.
                </p>
              </div>

              <SearchFilterBar
                searchValue={updateSearch}
                onSearchChange={setUpdateSearch}
                searchPlaceholder="Search by title..."
                filters={[
                  {
                    value: updateCategoryFilter,
                    onChange: setUpdateCategoryFilter,
                    options: updateCategoryOptions.map((opt) => ({
                      value: opt,
                      label: opt === ALL ? "All Categories" : opt,
                    })),
                  },
                ]}
              />

              <AsyncState
                loading={updatesLoading}
                error={updatesError}
                empty={filteredFpUpdates.length === 0}
                onRetry={refetchUpdates}
                loadingLabel="Loading updates..."
                emptyLabel={
                  fpUpdates.length === 0
                    ? "No updates available at the moment."
                    : "No results match your filters."
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFpUpdates.map((update) => (
                    <div
                      key={update.id}
                      className="border border-gray-100 bg-white rounded-xl p-5 shadow-sm flex flex-col"
                    >
                      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand text-white mb-3">
                        <BookOpen size={16} />
                      </span>
                      <p className="text-sm font-semibold text-gray-900 mb-2 flex-1">
                        {update.title}
                      </p>
                      {update.description && (
                        <p className="text-xs text-gray-400 mb-3">{update.description}</p>
                      )}
                      <span className="inline-block text-[11px] font-medium text-brand bg-brand/5 px-2.5 py-0.5 rounded-full mb-3 w-fit">
                        {update.classification || update.category}
                      </span>
                      {update.button?.url && (
                        <button
                          onClick={() => {
                            const url = update.button.url;
                            if (url.startsWith("/")) {
                              navigate(url);
                              return;
                            }
                            window.open(url, "_blank", "noopener,noreferrer");
                          }}
                          className="mt-auto text-sm font-medium text-white bg-brand hover:bg-brand-dark rounded-xl py-2.5 transition-colors"
                        >
                          {update.button.label || "Open"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </AsyncState>
            </div>
          )}

          {/* FALLBACK FOR OTHER SIDEBAR VIEWS */}
          {!["Dashboard", "KPIs", "Updates"].includes(activeSidebarNav) && (
            <div className="p-12 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
              <h3 className="text-base font-semibold text-gray-900">
                {activeSidebarNav} Module
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                This section is currently under development.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}