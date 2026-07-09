import { useCallback, useMemo, useState } from "react";
import StudentLayout from "../../components/student/StudentLayout";
import AsyncState from "../../components/common/AsyncState";
import { Search, ChevronDown } from "../../lib/icons";
import { getListItems } from "../../api/client";
import { students } from "../../api/services";
import { mapSubmissionsFromApi } from "../../lib/submissionMapper";
import { useApiQuery } from "../../hooks/useApiResource";

const STATUS_STYLES = {
  "In Review": "bg-gray-100 text-gray-500",
  Resolved: "bg-emerald-50 text-emerald-600",
};

export default function StudentSubmissionsList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [type, setType] = useState("All Types");

  const { data, loading, error, refetch } = useApiQuery(
    useCallback(() => students.feedbackTracking.list(), []),
  );

  const submissions = useMemo(
    () => mapSubmissionsFromApi(getListItems(data)),
    [data],
  );

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const matchesSearch = submission.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === "All Categories" || submission.category === category;
      const matchesType =
        type === "All Types" || submission.submissionType === type;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [category, search, submissions, type]);

  return (
    <StudentLayout sessionLabel="2025/2026 Session">
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 md:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          My Submissions
        </h2>
        <p className="text-sm text-gray-400 mb-5">
          Select the option that best describes your student voice submission
        </p>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 flex-1">
            <Search size={15} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Title"
              className="text-sm w-full outline-none placeholder-gray-400"
            />
          </div>

          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none border border-gray-200 rounded-md pl-3 pr-8 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            >
              <option>All Categories</option>
              <option>Academics</option>
              <option>Hostel/Welfare</option>
              <option>Facilities</option>
              <option>Staff Conduct</option>
              <option>Admin Delays</option>
              <option>Safety/Security</option>
              <option>Results</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          <div className="relative">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="appearance-none border border-gray-200 rounded-md pl-3 pr-8 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            >
              <option>All Types</option>
              <option>Complaint</option>
              <option>Suggestion</option>
              <option>Comment</option>
              <option>Feedback</option>
              <option>Concern</option>
              <option>Service Request</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          <AsyncState
            loading={loading}
            error={error}
            empty={filteredSubmissions.length === 0}
            onRetry={refetch}
            loadingLabel="Loading submissions..."
            emptyLabel="No submissions found."
          >
            {filteredSubmissions.map((s, i) => (
              <div
                key={`${s.id}-${i}`}
                className="border border-gray-100 rounded-lg px-4 py-4 flex items-center justify-between flex-wrap gap-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    {s.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="text-emerald-600 border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {s.category}
                    </span>
                    <span>{s.id}</span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                    STATUS_STYLES[s.status] || "bg-gray-100 text-gray-500"
                  }`}
                >
                  {s.status === "In Review" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  )}
                  {s.status}
                </span>
              </div>
            ))}
          </AsyncState>
        </div>
      </div>
    </StudentLayout>
  );
}


// import {
//   FileText,
//   MessageSquareText,
//   MessageCircle,
//   Lightbulb,
//   AlertTriangle,
//   Headphones,
// } from "../../../lib/icons";

// // NOTE: the design shows the same subtitle ("Report an issue that needs
// // to be addressed") repeated under every option — that looks like a
// // copy/paste placeholder in the source mockup rather than intentional.
// // Replicated as-is below; swap in per-option descriptions once you have
// // real copy for each submission type.
// const TYPES = [
//   { label: "Complaint", icon: FileText, description: "Report an issue that needs to be addressed" },
//   { label: "Suggestion", icon: MessageSquareText, description: "Report an issue that needs to be addressed" },
//   { label: "Comment", icon: MessageCircle, description: "Report an issue that needs to be addressed" },
//   { label: "Feedback", icon: Lightbulb, description: "Report an issue that needs to be addressed" },
//   { label: "Concern", icon: AlertTriangle, description: "Report an issue that needs to be addressed" },
//   { label: "Service Request", icon: Headphones, description: "Report an issue that needs to be addressed" },
// ];

// export default function SubmissionTypeStep({ value, onChange, onContinue }) {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">
//         What type of submission is this?
//       </h2>
//       <p className="text-sm text-gray-400 text-center mb-6">
//         Select the option that best describes your student voice submission
//       </p>

//       <div className="space-y-3">
//         {TYPES.map(({ label, icon: Icon, description }) => (
//           <label
//             key={label}
//             className={`flex items-start sm:items-center justify-between gap-3 border rounded-lg px-4 py-3 cursor-pointer ${
//               value === label
//                 ? "border-brand bg-brand/5"
//                 : "border-gray-200 hover:border-gray-300"
//             }`}
//           >
//             <span className="flex items-start sm:items-center gap-3 min-w-0">
//               <Icon size={18} className="text-gray-500 shrink-0 mt-0.5 sm:mt-0" />
//               <span className="min-w-0">
//                 <span className="block text-sm font-medium text-gray-900">
//                   {label}
//                 </span>
//                 <span className="block text-xs text-gray-400">
//                   {description}
//                 </span>
//               </span>
//             </span>
//             <input
//               type="radio"
//               name="submission-type"
//               checked={value === label}
//               onChange={() => onChange(label)}
//               className="text-brand focus:ring-brand shrink-0 mt-0.5"
//             />
//           </label>
//         ))}
//       </div>

//       <button
//         onClick={onContinue}
//         className="w-full mt-6 bg-brand hover:bg-brand-dark text-white text-base font-medium py-2.5 rounded-[10px]"
//       >
//         Continue
//       </button>
//     </div>
//   );
// }