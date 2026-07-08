import { useCallback } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AsyncState from "../components/common/AsyncState";
import FeedbackCaseCard from "../components/dashboard/FeedbackCaseCard";
import { useApiQuery } from "../hooks/useApiResource";
import { getListItems, replaceListItem } from "../api/client";
import { students } from "../api/services";
import { mapFeedbackListForStaff } from "../lib/submissionMapper";

export default function FPLanding() {
  const {
    data: feedbackResponse,
    loading,
    error,
    refetch,
    setData: setFeedbackResponse,
  } = useApiQuery(useCallback(() => students.feedback.list(), []));

  const cases = mapFeedbackListForStaff(getListItems(feedbackResponse));

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
      <section className="max-w-4xl mx-auto px-4 mb-16">
        <img
          src="/dashboard-preview.png"
          alt="Quality Assurance dashboard preview"
          className="w-full rounded-xl shadow-lg border border-gray-100"
        />
      </section>

      {/* Case queue */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Assigned Cases
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Student complaints and feedback awaiting review.
        </p>

        <AsyncState
          loading={loading}
          error={error}
          empty={cases.length === 0}
          onRetry={refetch}
          loadingLabel="Loading assigned cases..."
          emptyLabel="No cases assigned yet."
        >
          {cases.map((item) => (
            <FeedbackCaseCard
              key={item.id}
              item={item}
              actions={["reply", "status"]}
              onUpdated={handleCaseUpdated}
            />
          ))}
        </AsyncState>
      </section>

      <Footer />
    </div>
  );
}
