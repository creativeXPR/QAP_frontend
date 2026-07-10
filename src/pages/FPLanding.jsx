import { useCallback, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar"; // shared top nav bar
import Footer from "../components/layout/Footer";
import AsyncState from "../components/common/AsyncState";
import SearchFilterBar from "../components/common/SearchFilterBar";
import { useApiQuery } from "../hooks/useApiResource"; // hook: fires a GET on mount, tracks {data, loading, error}
import { getListItems, replaceListItem } from "../api/client"; // helpers to read paginated list responses / patch one item in them
import { students, analytics } from "../api/services"; // grouped API calls under /api/students/... and /api/analytics/...
import {
  BarChart2,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  BookOpen,
  Bell,
} from "../lib/icons";

const ALL = "all";

export default function FPLanding() {
  const navigate = useNavigate();
  const updatesSectionRef = useRef(null);

  const scrollToUpdates = () => {
    updatesSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Live API call: GET /api/students/feedback/ on mount.
  // `feedbackResponse` is the raw (possibly paginated) API payload;
  // `setFeedbackResponse` lets us patch it locally after an update
  // instead of re-fetching; `refetch` re-runs the GET on demand.
  const {
    data: feedbackResponse,
    loading,
    error,
    refetch,
    setData: setFeedbackResponse,
  } = useApiQuery(useCallback(() => students.feedback.list(), []));

  // Live API call: GET /api/updates/endpoints/ on mount, filtered to
  // this role — mirrors how StudentDashboard.jsx does it for
  // forUser === "student".
  const {
    data: updatesResponse,
    loading: updatesLoading,
    error: updatesError,
    refetch: refetchUpdates,
  } = useApiQuery(useCallback(() => analytics.updates.list(), []));

  const fpUpdates = useMemo(
    () => getListItems(updatesResponse).filter((item) => item.forUser === "focal_person"),
    [updatesResponse],
  );

  // Total count of updates available to this focal person.
  const stats = useMemo(
    () => [
      { label: "Total Update", value: fpUpdates.length, icon: BarChart2 },
    ],
    [fpUpdates],
  );

  /* ---------------- Updates filter ---------------- */

  const [updateSearch, setUpdateSearch] = useState("");
  const [updateCategoryFilter, setUpdateCategoryFilter] = useState(ALL);

  const updateCategoryOptions = useMemo(() => {
    const unique = [...new Set(fpUpdates.map((u) => u.category).filter(Boolean))];
    return [ALL, ...unique];
  }, [fpUpdates]);

  const filteredFpUpdates = useMemo(() => {
    const query = updateSearch.trim().toLowerCase();
    return fpUpdates.filter((u) => {
      const matchesSearch = !query || (u.title || "").toLowerCase().includes(query);
      const matchesCategory = updateCategoryFilter === ALL || u.category === updateCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [fpUpdates, updateSearch, updateCategoryFilter]);

  // Called after a case is edited elsewhere (e.g. a modal/detail view
  // calling a PATCH endpoint) — splices the updated item back into
  // `feedbackResponse` locally so the UI reflects it without a refetch.
  const handleCaseUpdated = (updated) => {
    setFeedbackResponse((prev) => replaceListItem(prev, updated.id, updated));
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar ctaLabel="View Profile" ctaTo="/profile/me" />

      {/* Hero — static marketing/intro copy, no API data involved. */}
      <section className="max-w-3xl mx-auto text-center px-4 pt-14 pb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Welcome to the Quality Assurance Platform
        </h1>
        <p className="text-gray-500 mb-6 max-w-xl mx-auto">
          Access all assigned quality assurance evaluations, track submission
          status, and meet deadlines with ease.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={scrollToUpdates}
            className="bg-brand hover:bg-brand-dark text-white text-base font-medium px-5 py-2.5 rounded-[10px]"
          >
            Start Submission
          </button>
          <Link
            to="/profile/me"
            className="border border-gray-300 text-gray-700 text-base font-medium px-5 py-2.5 rounded-[10px] hover:bg-gray-50"
          >
            View My Profile
          </Link>
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

      <div ref={updatesSectionRef} className="max-w-7xl mx-auto px-4 md:px-8 pb-16 space-y-6">
        {/* Stat cards — driven by `stats` (derived from live `fpUpdates` data above). */}
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

        {/* Updates — live data from analytics.updates.list(), filtered to
            forUser === "focal_person" (mirrors StudentDashboard.jsx's
            "Available Forms" section for forUser === "student"). */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1">
            <Bell size={15} />
            Updates
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Quality assurance updates and forms assigned to focal persons.
          </p>

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
            emptyLabel={fpUpdates.length === 0 ? "No updates available at the moment." : "No results match your filters."}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredFpUpdates.map((update) => (
                <div
                  key={update.id}
                  className="border border-gray-100 rounded-lg p-4 flex flex-col"
                >
                  <span className="flex items-center justify-center w-9 h-9 rounded-md bg-brand text-white mb-3">
                    <BookOpen size={16} />
                  </span>
                  <p className="text-sm font-semibold text-gray-900 mb-2 flex-1">
                    {update.title}
                  </p>
                  {update.description && (
                    <p className="text-xs text-gray-400 mb-3">{update.description}</p>
                  )}
                  <span className="inline-block text-[11px] font-medium text-brand bg-brand/5 px-2 py-0.5 rounded-full mb-3 w-fit">
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
                      className="mt-auto text-sm font-medium text-white bg-brand hover:bg-brand-dark rounded-[10px] py-2"
                    >
                      {update.button.label || "Open"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </AsyncState>
        </div>
      </div>

      <Footer />
    </div>
  );
}
