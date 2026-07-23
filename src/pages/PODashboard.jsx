import { useCallback, useMemo, useState } from "react";
import StatCard from "../components/dashboard/StatCard";
import {
  Search,
  FileText,
  Clock3,
  Bell,
  BarChart2,
  BookOpen,
  Briefcase,
  LayoutDashboard,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  LogOut,
} from "../lib/icons";
import AsyncState from "../components/common/AsyncState";
import SearchFilterBar from "../components/common/SearchFilterBar";
import { useApiQuery } from "../hooks/useApiResource";
import { getListItems } from "../api/client";
import { analytics } from "../api/services";

// Dynamic Status Icons and Styles
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

const TYPE_ICON = {
  Academic: BookOpen,
  Administrative: Briefcase,
};

function UpdateCard({ update }) {
  const Icon = TYPE_ICON[update.type] || FileText;
  return (
    <div className="border border-gray-100 rounded-xl p-5 bg-white shadow-sm">
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand bg-brand/5 px-2.5 py-1 rounded-full mb-3">
        <Icon size={13} />
        {update.type}
      </span>
      <h3 className="text-sm font-semibold text-gray-900 mb-2">
        {update.title}
      </h3>
      <span className="inline-block text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-2">
        {update.tag}
      </span>
      {update.dueDate && (
        <p className="text-xs text-gray-400 mb-3">Due: {update.dueDate}</p>
      )}
      {update.links && update.links.map((link) => (
        <a
          key={link.title}
          href={link.url}
          className="block text-center text-sm font-medium bg-brand hover:bg-brand-dark text-white py-2 rounded-lg transition-colors mt-2"
        >
          {link.title}
        </a>
      ))}
    </div>
  );
}

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

export default function PODashboard() {
  const [activeSidebarNav, setActiveSidebarNav] = useState("Dashboard");

  // Search & Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [updateSearch, setUpdateSearch] = useState("");
  const [updateTypeFilter, setUpdateTypeFilter] = useState("all");

  // API Hooks
  const {
    data: kpiResponse,
    loading: kpisLoading,
    error: kpisError,
    refetch: refetchKpis,
  } = useApiQuery(useCallback(() => analytics.kpis.list(), []));

  const {
    data: updatesResponse,
    loading: updatesLoading,
    error: updatesError,
    refetch: refetchUpdates,
  } = useApiQuery(useCallback(() => analytics.updates.list(), []));

  // Dynamic Data Mapping
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

  const updates = useMemo(() => {
    return getListItems(updatesResponse).map((item) => ({
      id: item.id,
      type: item.category,
      title: item.title,
      tag: item.classification,
      dueDate: item.dueDate || "",
      links: item.button
        ? [
            {
              title: item.button.label,
              url: item.button.url,
            },
          ]
        : [],
    }));
  }, [updatesResponse]);

  // Derived Filter Options
  const categoryOptions = useMemo(() => {
    const unique = [...new Set(kpis.map((k) => k.category).filter(Boolean))];
    return ["all", ...unique];
  }, [kpis]);

  const updateTypeOptions = useMemo(() => {
    const unique = [...new Set(updates.map((u) => u.type).filter(Boolean))];
    return ["all", ...unique];
  }, [updates]);

  // Filtered Results
  const filteredUpdates = useMemo(() => {
    const query = updateSearch.trim().toLowerCase();
    return updates.filter((u) => {
      const matchesSearch =
        !query || (u.title || "").toLowerCase().includes(query);
      const matchesType =
        updateTypeFilter === "all" || u.type === updateTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [updates, updateSearch, updateTypeFilter]);

  const filteredKpis = useMemo(() => {
    return kpis.filter((kpi) => {
      const matchesSearch =
        !search ||
        kpi.title.toLowerCase().includes(search.toLowerCase()) ||
        (kpi.analysisText ?? "").toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category === "all" || kpi.category === category;
      const matchesStatus = status === "all" || kpi.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [kpis, search, category, status]);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "KPIs", icon: BarChart2, badge: kpis.length },
    { label: "Updates", icon: Bell, badge: updates.length },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50/60 text-gray-800 font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Header & Logo */}
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

        {/* Sidebar Footer User Info */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
              po
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">
                Principal Officer
              </p>
              <span className="inline-block text-[10px] font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                Principal Officer
              </span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-medium py-2 rounded-xl transition-colors">
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Header */}
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Welcome Back, Principal Officer 👋
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">July, 23rd 2026</p>
          </div>

          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-1.5 bg-white text-xs text-gray-600 shadow-sm cursor-pointer hover:bg-gray-50">
            <span>2025/2026</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </header>

        {/* View Content Body */}
        <main className="p-8 max-w-7xl w-full">
          {/* VIEW: OVERVIEW DASHBOARD */}
          {activeSidebarNav === "Dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                  icon={FileText}
                  label="Total KPIs"
                  value={kpis.length}
                />
                <StatCard
                  icon={Clock3}
                  label="Total PMP Updates"
                  value={updates.length}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                {/* Key Metrics Quick Preview */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <BarChart2 size={18} className="text-indigo-600" />
                      Key Performance Indicators
                    </h2>
                    <button
                      onClick={() => setActiveSidebarNav("KPIs")}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <AsyncState
                    loading={kpisLoading}
                    error={kpisError}
                    empty={kpis.length === 0}
                    onRetry={refetchKpis}
                    loadingLabel="Loading KPIs..."
                    emptyLabel="No KPIs found."
                  >
                    <div className="space-y-3">
                      {kpis.slice(0, 2).map((k) => (
                        <KPICard key={k.id} kpi={k} />
                      ))}
                    </div>
                  </AsyncState>
                </div>

                {/* Updates Quick Preview */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <Bell size={18} className="text-indigo-600" />
                      Recent Updates
                    </h2>
                    <button
                      onClick={() => setActiveSidebarNav("Updates")}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <AsyncState
                    loading={updatesLoading}
                    error={updatesError}
                    empty={updates.length === 0}
                    onRetry={refetchUpdates}
                    loadingLabel="Loading updates..."
                    emptyLabel="No updates available."
                  >
                    <div className="space-y-3">
                      {updates.slice(0, 2).map((u) => (
                        <UpdateCard key={u.id} update={u} />
                      ))}
                    </div>
                  </AsyncState>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: KPIS SECTION */}
          {activeSidebarNav === "KPIs" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Key Performance Indicators</h2>
                <p className="text-xs text-gray-400 mt-0.5">Track institutional metrics and performance analytics</p>
              </div>

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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search KPI title..."
                        className="text-sm w-full outline-none placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">Category Filter</p>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 capitalize outline-none"
                    >
                      {categoryOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt === "all" ? "All Categories" : opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1.5">Status Filter</p>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none"
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
                    onClick={resetFilters}
                    className="text-xs font-semibold text-gray-600 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </section>

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

          {/* VIEW: UPDATES SECTION */}
          {activeSidebarNav === "Updates" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Principal Updates</h2>
                <p className="text-xs text-gray-400 mt-0.5">Academic and administrative updates</p>
              </div>

              <SearchFilterBar
                searchValue={updateSearch}
                onSearchChange={setUpdateSearch}
                searchPlaceholder="Search updates by title..."
                filters={[
                  {
                    value: updateTypeFilter,
                    onChange: setUpdateTypeFilter,
                    options: updateTypeOptions.map((opt) => ({
                      value: opt,
                      label: opt === "all" ? "All Types" : opt,
                    })),
                  },
                ]}
              />

              <AsyncState
                loading={updatesLoading}
                error={updatesError}
                empty={filteredUpdates.length === 0}
                onRetry={refetchUpdates}
                loadingLabel="Loading updates..."
                emptyLabel={
                  updates.length === 0
                    ? "No updates available."
                    : "No results match your filters."
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredUpdates.map((update) => (
                    <UpdateCard key={update.id} update={update} />
                  ))}
                </div>
              </AsyncState>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}