import { useState } from "react";
import POTopNav from "../components/layout/POTopNav";
import AdminFooter from "../components/layout/AdminFooter";
import StatCard from "../components/dashboard/StatCard";
import {
  Search,
  ChevronDown,
  FileText,
  Clock3,
  Bell,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Briefcase,
} from "../lib/icons";

// Sample data — no backend wiring for Updates/KPIs yet, matching the
// reference prototype's Firestore-driven cards but with placeholder
// content for now.
const UPDATES = [
  {
    type: "Academic",
    title: "New Curriculum Review Guidelines",
    tag: "Announcement",
    dueDate: "20/7/2026",
    links: [{ title: "View Document", url: "#" }],
  },
  {
    type: "Administrative",
    title: "Budget Submission Deadline Extended",
    tag: "Urgent",
    dueDate: "15/7/2026",
    links: [{ title: "View Update", url: "#" }],
  },
];

const KPIS = [
  {
    title: "Overall Completion Rate",
    category: "Academic",
    status: "Improving",
    value: "87.3%",
    changePercent: "+5.2%",
    changePeriod: "vs last month",
    analysisText:
      "Completion rates across academic departments have trended upward this quarter, driven by improved submission reminders.",
  },
  {
    title: "Administrative Turnaround Time",
    category: "Administrative",
    status: "Stable",
    value: "3.2 days",
    changePercent: "+0.1%",
    changePeriod: "vs last month",
    analysisText:
      "Average processing time for administrative requests has held steady, within the target range for this cycle.",
  },
  {
    title: "Infrastructure Maintenance Requests",
    category: "Infrastructure",
    status: "Declining",
    value: "142",
    changePercent: "-3.4%",
    changePeriod: "vs last month",
    analysisText:
      "Open maintenance requests have decreased slightly, though response times in some faculties still need attention.",
  },
];

const TYPE_ICON = {
  Academic: BookOpen,
  Administrative: Briefcase,
};

const STATUS_STYLES = {
  Improving: { icon: TrendingUp, className: "text-emerald-600 bg-emerald-50" },
  Stable: { icon: Minus, className: "text-amber-600 bg-amber-50" },
  Declining: { icon: TrendingDown, className: "text-red-500 bg-red-50" },
};

function UpdateCard({ update }) {
  const Icon = TYPE_ICON[update.type] || FileText;
  return (
    <div className="border border-gray-100 rounded-lg p-4 bg-white">
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand bg-brand/5 px-2 py-1 rounded-full mb-3">
        <Icon size={13} />
        {update.type}
      </span>
      <h3 className="text-sm font-semibold text-gray-900 mb-2">{update.title}</h3>
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

function KPICard({ kpi }) {
  const [open, setOpen] = useState(false);
  const { icon: StatusIcon, className: statusClass } =
    STATUS_STYLES[kpi.status] || STATUS_STYLES.Stable;

  return (
    <div className="border border-gray-100 rounded-lg bg-white mb-3 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left"
      >
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{kpi.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{kpi.category}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${statusClass}`}
          >
            <StatusIcon size={12} />
            {kpi.status}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-semibold text-brand">{kpi.value}</span>
            <span className="text-xs text-gray-400">
              {kpi.changePercent} ({kpi.changePeriod})
            </span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">{kpi.analysisText}</p>
        </div>
      )}
    </div>
  );
}

function CollapsibleSection({ icon: Icon, title, subtitle, children }) {
  const [open, setOpen] = useState(false);
  return (
    <section>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 border border-gray-100 rounded-lg px-4 py-3 bg-white sticky top-0 z-10"
      >
        <div className="text-left">
          <h2 className="flex items-center gap-2 text-brand font-semibold text-base">
            <Icon size={16} />
            {title}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && <div className="mt-4">{children}</div>}
    </section>
  );
}

export default function PODashboard() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard icon={FileText} label="Total KPIs" value="24" />
          <StatCard icon={Clock3} label="Total PMP Updates" value="8" />
        </div>

        {/* Filters */}
        <section className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
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
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600"
              >
                <option value="all">All Categories</option>
                <option value="academic">Academic</option>
                <option value="administrative">Administrative</option>
                <option value="infrastructure">Infrastructure</option>
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
            <button className="text-base text-brand border border-gray-200 px-4 py-2 rounded-[10px] hover:bg-gray-50">
              Reset Filters
            </button>
            <button className="text-base text-white bg-brand hover:bg-brand-dark px-4 py-2 rounded-[10px]">
              Apply Filters
            </button>
          </div>
        </section>

        {/* Updates (collapsible) */}
        <CollapsibleSection
          icon={Bell}
          title="Updates"
          subtitle="Principal updates with expandable cards for better readability"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {UPDATES.map((update) => (
              <UpdateCard key={update.title} update={update} />
            ))}
          </div>
        </CollapsibleSection>

        {/* KPIs (collapsible, each card independently collapsible) */}
        <CollapsibleSection
          icon={BarChart2}
          title="KPIs"
          subtitle="KPI cards with expandable descriptions and charts"
        >
          {KPIS.map((kpi) => (
            <KPICard key={kpi.title} kpi={kpi} />
          ))}
        </CollapsibleSection>
      </main>

      <AdminFooter />
    </div>
  );
}