import { useCallback, useMemo, useRef, useState } from "react";
import POTopNav from "../components/layout/POTopNav";
import AdminFooter from "../components/layout/AdminFooter";
import StatCard from "../components/dashboard/StatCard";
import KPICard from "../components/dashboard/KPICard";
import CollapsibleSection from "../components/dashboard/CollapsibleSection";
import {
  Search,
  FileText,
  Clock3,
  Bell,
  BarChart2,
  BookOpen,
  Briefcase,
} from "../lib/icons";
import AsyncState from "../components/common/AsyncState";
import SearchFilterBar from "../components/common/SearchFilterBar";
import { useApiQuery } from "../hooks/useApiResource";
import { getListItems } from "../api/client";
import { analytics } from "../api/services";

// =====================================================================
// PLACEHOLDER DATA — no backend endpoint for KPIs or PMP Updates exists
// in api/services.js yet. This mirrors the shape the reference "pmp"
// template expects from its Firestore `kpis` and `updates` collections.
//
// When a real endpoint exists, replace this block with something like:
//
//   const { data: kpiResponse, loading: kpisLoading, error: kpisError,
//           refetch: refetchKpis } = useApiQuery(
//     useCallback(() => qualityAssurance.kpis.list(), [])
//   );
//   const kpis = getListItems(kpiResponse);
//
//   const { data: updatesResponse, loading: updatesLoading, error: updatesError,
//           refetch: refetchUpdates } = useApiQuery(
//     useCallback(() => qualityAssurance.principalUpdates.list(), [])
//   );
//   const updates = getListItems(updatesResponse);
//
// (Swap `qualityAssurance.kpis` / `qualityAssurance.principalUpdates` for
// whatever resource name actually gets registered in api/services.js.)
// =====================================================================

const PLACEHOLDER_KPIS = [
  {
    id: "kpi-1",
    title: "Overall Completion Rate",
    category: "academic",
    status: "improving",
    value: "87.3%",
    changePercent: "+5.2%",
    changePeriod: "vs last month",
    analysisText:
      "Completion rates across academic departments have trended upward this quarter, driven by improved submission reminders.",
  },
  {
    id: "kpi-2",
    title: "Administrative Turnaround Time",
    category: "administrative",
    status: "stable",
    value: "3.2 days",
    changePercent: "+0.1%",
    changePeriod: "vs last month",
    analysisText:
      "Average processing time for administrative requests has held steady, within the target range for this cycle.",
  },
  {
    id: "kpi-3",
    title: "Infrastructure Maintenance Requests",
    category: "infrastructure",
    status: "declining",
    value: "142",
    changePercent: "-3.4%",
    changePeriod: "vs last month",
    analysisText:
      "Open maintenance requests have decreased slightly, though response times in some faculties still need attention.",
  },
];

const PLACEHOLDER_UPDATES = [
  {
    id: "update-1",
    type: "Academic",
    title: "New Curriculum Review Guidelines",
    tag: "Announcement",
    dueDate: "20/7/2026",
    links: [{ title: "View Document", url: "#" }],
  },
  {
    id: "update-2",
    type: "Administrative",
    title: "Budget Submission Deadline Extended",
    tag: "Urgent",
    dueDate: "15/7/2026",
    links: [{ title: "View Update", url: "#" }],
  },
];

const TYPE_ICON = {
  Academic: BookOpen,
  Administrative: Briefcase,
};

function UpdateCard({ update }) {
  const Icon = TYPE_ICON[update.type] || FileText;
  return (
    <div className="border border-gray-100 rounded-lg p-4 bg-white">
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand bg-brand/5 px-2 py-1 rounded-full mb-3">
        <Icon size={13} />
        {update.type}
      </span>
      <h3 className="text-sm font-semibold text-gray-900 mb-2">
        {update.title}
      </h3>
      <span className="inline-block text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-2">
        {update.tag}
      </span>
      <p className="text-xs text-gray-400 mb-3">Due: {update.dueDate}</p>
      {update.links.map((link) => (
        <a
          key={link.title}
          href={link.url}
          className="block text-center text-base font-medium bg-brand hover:bg-brand-dark text-white py-2 rounded-[10px]"
        >
          {link.title}
        </a>
      ))}
    </div>
  );
}

export default function PODashboard() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [openKpis, setOpenKpis] = useState(false);
  const kpiSectionRef = useRef(null);

  // TODO (real API): once KPIs come from the backend, drop this line and
  // do `const kpis = getListItems(kpiResponse);` instead.
  // const kpis = PLACEHOLDER_KPIS;
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
  const updates = useMemo(() => {
    return getListItems(updatesResponse).map((item) => ({
      id: item.id,
      type: item.category,
      title: item.title,
      tag: item.classification,
      dueDate: "",
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

  // Category options are derived from the actual KPI data (matching the
  // reference's dynamic category-filter behavior), not hardcoded.
  const categoryOptions = useMemo(() => {
    const unique = [...new Set(kpis.map((k) => k.category).filter(Boolean))];
    return ["all", ...unique];
  }, [kpis]);

  /* ---------------- Updates filter ---------------- */

  const [updateSearch, setUpdateSearch] = useState("");
  const [updateTypeFilter, setUpdateTypeFilter] = useState("all");

  const updateTypeOptions = useMemo(() => {
    const unique = [...new Set(updates.map((u) => u.type).filter(Boolean))];
    return ["all", ...unique];
  }, [updates]);

  const filteredUpdates = useMemo(() => {
    const query = updateSearch.trim().toLowerCase();
    return updates.filter((u) => {
      const matchesSearch = !query || (u.title || "").toLowerCase().includes(query);
      const matchesType = updateTypeFilter === "all" || u.type === updateTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [updates, updateSearch, updateTypeFilter]);

  // const filteredKpis = useMemo(() => {
  //   return kpis.filter((kpi) => {
  //     const matchesSearch =
  //       !search ||
  //       kpi.title.toLowerCase().includes(search.toLowerCase()) ||
  //       kpi.analysisText.toLowerCase().includes(search.toLowerCase());
  //     const matchesCategory = category === "all" || kpi.category === category;
  //     const matchesStatus = status === "all" || kpi.status === status;
  //     return matchesSearch && matchesCategory && matchesStatus;
  //   });
  // }, [kpis, search, category, status]);

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <POTopNav
        onAnalyzeClick={() => {
          setOpenKpis(true);

          setTimeout(() => {
            kpiSectionRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 100);
        }}
      />{" "}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Principal Officer Dashboard
          </h1>
          <p className="text-xs text-gray-400">
            Quality Assurance Performance Overview
          </p>
        </div>

        {/* Overview stats — TODO (real API): these counts should come
            from the backend once KPIs/Updates are wired up, e.g.
            kpis.filter(k => !k.disabled).length */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard icon={FileText} label="Total KPIs" value={kpis.length} />
          <StatCard
            icon={Clock3}
            label="Total PMP Updates"
            value={updates.length}
          />
        </div>

        {/* Updates (collapsible) */}
        <CollapsibleSection
          icon={Bell}
          title="Updates"
          subtitle="Principal updates with expandable cards for better readability"
          filterNode={
            <SearchFilterBar
              searchValue={updateSearch}
              onSearchChange={setUpdateSearch}
              searchPlaceholder="Search by title..."
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
          }
        >
          <AsyncState
            loading={updatesLoading}
            error={updatesError}
            empty={filteredUpdates.length === 0}
            onRetry={refetchUpdates}
            loadingLabel="Loading updates..."
            emptyLabel={updates.length === 0 ? "No updates available." : "No results match your filters."}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredUpdates.map((update) => (
                <UpdateCard key={update.id} update={update} />
              ))}
            </div>
          </AsyncState>
        </CollapsibleSection>

        {/* KPIs (collapsible, each card independently collapsible) */}
        <div ref={kpiSectionRef}>
          <CollapsibleSection
            icon={BarChart2}
            title="KPIs"
            subtitle="KPI cards with expandable descriptions and charts"
            open={openKpis}
            onToggle={setOpenKpis}
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
                      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 capitalize"
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
                    onClick={resetFilters}
                    className="text-base text-brand border border-gray-200 px-4 py-2 rounded-[10px] hover:bg-gray-50"
                  >
                    Reset Filters
                  </button>
                  {/* "Apply Filters" is a no-op here since filtering already
                      happens live as you type/select, matching modern UX
                      expectations — kept for visual parity with the reference. */}
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
        </div>
      </main>
      {/* <AdminFooter /> */}
    </div>
  );
}
