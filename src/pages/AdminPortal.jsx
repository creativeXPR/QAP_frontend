import { useCallback } from "react";
import AdminTopNav from "../components/layout/AdminTopNav";     // shared admin top nav
import AdminFooter from "../components/layout/AdminFooter";     // shared admin footer
import StatCard from "../components/dashboard/StatCard";        // small icon+label+value metric tile
import DataTable from "../components/dashboard/DataTable";      // generic table (columns + rows + row actions)
import AsyncState from "../components/common/AsyncState";       // wraps children with loading/error/empty UI
import FeedbackCaseCard from "../components/dashboard/FeedbackCaseCard"; // renders one support/feedback case + actions
import { useApiQuery } from "../hooks/useApiResource";          // hook: fires a GET on mount, tracks {data, loading, error}
import { getListItems, replaceListItem, removeListItem } from "../api/client"; // helpers for paginated list responses (read/patch/remove one item)
import { students } from "../api/services";                     // grouped API calls under /api/students/...
import { mapFeedbackListForStaff } from "../lib/submissionMapper"; // normalizes raw feedback API rows into UI-friendly case objects
import {
  Users,
  TrendingUp,
  FileText,
  UploadCloud,
  Trash2,
  Headphones,
} from "../lib/icons";

// ===== Sample data — none of these sections have a backend wired up
// yet (status requests, updates tables, user actions log, support
// issues); placeholders matching the reference's Firestore-driven
// content until real endpoints exist. =====
//
// TO WIRE UP REAL DATA WHEN THE BACKEND ENDPOINTS EXIST:
// The overall pattern is always the same one already used for the
// "User Support Issues" section at the bottom of this file (feedback
// via `students.feedback.list()` + useApiQuery). For each table below:
//
//   1. Add/confirm the resource in src/api/services.js. Several likely
//      already exist and just need wiring here, e.g.:
//        - Form Logs / FP Updates  -> a new `students.forms` /
//          `students.updates` resource (not yet defined), OR reuse
//          `documents.documents` (createResource) if forms are modeled
//          as institutional documents.
//        - KPI Library / PO Updates -> `accreditation.metrics` /
//          `accreditation.submissions` are close matches already
//          exported from services.js.
//        - FP/PO User Management   -> would need a `users` resource
//          (not yet defined) — likely /api/accounts/users/ or similar.
//        - User Actions log        -> `dashboards.activityFeed(params)`
//          already exists in services.js and returns exactly this kind
//          of feed.
//        - Top-of-page stat numbers (Registered Users, Submission
//          Rates, Report Generation Count, Focal/Principal/Admin User
//          counts) -> `dashboards.summary(params)` already exists and
//          is built for aggregate counts like these.
//
//   2. Fetch with useApiQuery, e.g.:
//        const { data, loading, error } = useApiQuery(
//          useCallback(() => dashboards.activityFeed(), [])
//        );
//        const rows = getListItems(data);
//
//   3. Swap the relevant *_ROWS constant for `rows` in the DataTable's
//      `rows` prop, and wrap the table (or section) in <AsyncState
//      loading={...} error={...}> so it matches the Support Issues
//      section's loading/error/empty handling.

const FORM_LOGS_COLUMNS = [
  { key: "title", label: "Form Title" },
  { key: "category", label: "Category", type: "badge" },
  { key: "status", label: "Status", type: "badge" },
  { key: "dueDate", label: "Due Date" },
  { key: "submissions", label: "Submissions" },
];

const FORM_LOGS_ROWS = [
  { title: "Course Evaluation Form", category: "Academic", status: "Active", dueDate: "2026-01-15", submissions: 340 },
  { title: "Faculty Research Output Assessment", category: "Academic", status: "Active", dueDate: "2025-07-15", submissions: 127 },
  { title: "Department Resource Allocation", category: "Administrative", status: "Active", dueDate: "2026-01-15", submissions: 68 },
  { title: "Student Feedback Survey", category: "Academic", status: "Draft", dueDate: "2026-01-15", submissions: 0 },
];

const FP_UPDATES_COLUMNS = [
  { key: "title", label: "Update Title" },
  { key: "category", label: "Category", type: "badge" },
  { key: "status", label: "Status", type: "badge" },
  { key: "dueDate", label: "Due Date" },
  { key: "dateUpdated", label: "Date Updated" },
];

const FP_UPDATES_ROWS = [
  { title: "New Curriculum Review Guidelines", category: "Academic", status: "Active", dueDate: "2026-07-20", dateUpdated: "2026-07-05" },
  { title: "Exam Venue Change Protocol", category: "Administrative", status: "Draft", dueDate: "2026-07-25", dateUpdated: "2026-07-01" },
];

const FP_USER_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "department", label: "Department / Unit" },
  { key: "email", label: "Email" },
  { key: "permissions", label: "Permissions", type: "badge" },
];

const FP_USER_ROWS = [
  { name: "Dr. Adewale Ogunleye", department: "Computer Science", email: "a.ogunleye@ui.edu.ng", permissions: "Edit & Submit" },
  { name: "Prof. Chinyere Nwosu", department: "Medicine & Surgery", email: "c.nwosu@ui.edu.ng", permissions: "Edit & Submit" },
  { name: "Dr. Ibrahim Lawal", department: "Chemistry", email: "i.lawal@ui.edu.ng", permissions: "View Only" },
];

const KPI_LIBRARY_COLUMNS = [
  { key: "name", label: "KPI Name" },
  { key: "category", label: "Category", type: "badge" },
  { key: "status", label: "Status", type: "badge" },
  { key: "lastUploaded", label: "Last Uploaded" },
];

const KPI_LIBRARY_ROWS = [
  { name: "Student Graduation Rate", category: "Academic", status: "Active", lastUploaded: "2026-01-15" },
  { name: "Budget Utilization Efficiency", category: "Administrative", status: "Active", lastUploaded: "2026-01-15" },
];

const PO_UPDATES_ROWS = [
  { name: "Infrastructure Maintenance Backlog", category: "Infrastructure", status: "Active", lastUploaded: "2026-07-02" },
  { name: "Quarterly Performance Summary", category: "Administrative", status: "Draft", lastUploaded: "2026-06-30" },
];

const PO_USER_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "office", label: "Office / Unit" },
  { key: "email", label: "Email" },
  { key: "accessLevel", label: "Data Access Level", type: "badge" },
];

const PO_USER_ROWS = [
  { name: "Prof. Oluwaseun Ajayi", office: "Vice Chancellor's Office", email: "o.ajayi@ui.edu.ng", accessLevel: "University-wide" },
  { name: "Dr. Ngozi Okafor", office: "Academic Planning Unit", email: "n.okafor@ui.edu.ng", accessLevel: "Academic View" },
];

const USER_ACTIONS = [
  { name: "Prof. Oluwaseun Ajayi", time: "2026-07-06 14:22:01" },
  { name: "Dr. Ngozi Okafor", time: "2026-07-06 12:00:00" },
  { name: "Mr. Tunde Babatunde", time: "2026-07-05 09:15:42" },
];

function SectionHeaderButtons({ uploadLabel, deleteLabel, deleteHref }) {
  return (
    <div className="flex gap-3 flex-wrap">
      <button className="flex items-center gap-2 text-base font-medium bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-[10px]">
        <UploadCloud size={15} />
        {uploadLabel}
      </button>
      <a
        href={deleteHref}
        className="flex items-center gap-2 text-base font-medium bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-[10px]"
      >
        <Trash2 size={15} />
        {deleteLabel}
      </a>
    </div>
  );
}

export default function AdminPortal() {
  // Live API call: GET /api/students/feedback/ on mount. This is the
  // only section on this page already wired to a real endpoint —
  // use it as the template for wiring the placeholder tables above.
  const {
    data: feedbackResponse,
    loading: feedbackLoading,
    error: feedbackError,
    refetch: refetchFeedback,
    setData: setFeedbackResponse,
  } = useApiQuery(useCallback(() => students.feedback.list(), []));

  // Unwrap + normalize the raw response, then derive counts for the
  // "Total / Pending / Resolved" summary shown in the Support Issues banner.
  const feedbackItems = mapFeedbackListForStaff(getListItems(feedbackResponse));
  const totalIssues = feedbackItems.length;
  const pendingIssues = feedbackItems.filter((i) => i.rawStatus !== "resolved").length;
  const resolvedIssues = feedbackItems.filter((i) => i.rawStatus === "resolved").length;

  // Passed to FeedbackCaseCard so a reply/status change patches the
  // local list in place instead of refetching the whole collection.
  const handleCaseUpdated = (updated) => {
    setFeedbackResponse((prev) => replaceListItem(prev, updated.id, updated));
  };

  // Passed to FeedbackCaseCard so deleting a case removes it locally
  // right after the DELETE request succeeds.
  const handleCaseDeleted = (id) => {
    setFeedbackResponse((prev) => removeListItem(prev, id));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminTopNav />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-10">
        {/* System overview — "1,247" is hardcoded. Replace with
            dashboards.summary() (see top-of-file wiring notes) and pass
            the returned count as `value` instead of a literal string. */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            System Overview
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Real-time platform monitoring and metrics.
          </p>

          <div className="max-w-xs">
            <StatCard
              icon={Users}
              label="Registered Users"
              value="1,247"
              trend="Stable"
              variant="overview"
            />
          </div>

        {/* Accept column to be featured in future update */}
          {/* <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              User Status Requests
            </h3>
            <div className="space-y-3">
              {STATUS_REQUESTS.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between gap-3 border border-gray-100 rounded-lg bg-white p-4 flex-wrap"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{req.username}</p>
                    <p className="text-xs text-gray-400 truncate max-w-md">
                      {req.station} — {req.justification}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-gray-400">{req.date}</span>
                    <span className="text-[11px] font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                      principal
                    </span>
                    <button className="flex items-center gap-1 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md">
                      <CheckCircle2 size={13} />
                      Accept
                    </button>
                    <button className="text-gray-400 hover:text-red-500" aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </section>

        {/* FP Management — "Submission Rates" stat and all 3 tables below
            (Form Logs, Updates, FP User Management) use the static
            FORM_LOGS_ROWS / FP_UPDATES_ROWS / FP_USER_ROWS placeholders.
            See top-of-file wiring notes for candidate endpoints. */}
        <section id="fpm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                FP Management
              </h2>
              <p className="text-xs text-gray-400">
                Manage Focal Persons forms and user accounts.
              </p>
            </div>
            <SectionHeaderButtons
              uploadLabel="Upload New Forms/Updates"
              deleteLabel="Delete"
              deleteHref="#fp-entry-logs"
            />
          </div>

          <div className="max-w-xs mb-6">
            <StatCard
              icon={TrendingUp}
              label="Submission Rates"
              value="87.3%"
              caption="Average completion rates across all forms"
            />
          </div>

          <div id="fp-entry-logs" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Form Logs</h3>
              <DataTable
                columns={FORM_LOGS_COLUMNS}
                rows={FORM_LOGS_ROWS}
                actions={["view", "delete"]}
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Updates</h3>
              <DataTable
                columns={FP_UPDATES_COLUMNS}
                rows={FP_UPDATES_ROWS}
                actions={["view", "delete"]}
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                FP User Management
              </h3>
              <DataTable
                columns={FP_USER_COLUMNS}
                rows={FP_USER_ROWS}
                actions={["view", "edit", "delete"]}
              />
            </div>
          </div>
        </section>

        {/* User Infrastructure (PO Management) — "Report Generation
            Count" stat and all 3 tables (KPI Library, PO Updates, PO
            User Management) use static row data. KPI Library / PO
            Updates map well to accreditation.metrics /
            accreditation.submissions in services.js; see top-of-file
            wiring notes. */}
        <section id="pom">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-base font-semibold text-gray-900">
              User Infrastructure
            </h2>
            <SectionHeaderButtons
              uploadLabel="Upload New KPI Templates/Updates"
              deleteLabel="Delete"
              deleteHref="#kpi-library"
            />
          </div>

          <div className="max-w-xs mb-6">
            <StatCard
              icon={FileText}
              label="Report Generation Count"
              value="284"
              caption="Total KPIs + updates uploaded"
            />
          </div>

          <div id="kpi-library" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">KPI Library</h3>
              <DataTable
                columns={KPI_LIBRARY_COLUMNS}
                rows={KPI_LIBRARY_ROWS}
                actions={["view", "delete"]}
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">PO Updates</h3>
              <DataTable
                columns={KPI_LIBRARY_COLUMNS}
                rows={PO_UPDATES_ROWS}
                actions={["view", "delete"]}
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                PO User Management
              </h3>
              <DataTable
                columns={PO_USER_COLUMNS}
                rows={PO_USER_ROWS}
                actions={["view", "edit", "delete"]}
              />
            </div>
          </div>

          {/* User Actions — static USER_ACTIONS array. Maps directly to
              dashboards.activityFeed(params) already defined in
              services.js — swap the .map() source for that response's
              items once wired (see top-of-file wiring notes). */}
          <h3 className="text-sm font-semibold text-gray-900 mb-3">User Actions</h3>
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg bg-white">
            {USER_ACTIONS.map((action) => (
              <div key={action.name + action.time} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{action.name}</p>
                  <p className="text-xs text-gray-400">Last Active</p>
                </div>
                <span className="text-xs text-gray-400">{action.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* System Analytics Dashboard — every number here (Focal/
            Principal/Admin user counts, submission tracking bar, the
            Users/Forms/KPIs summary lists) is hardcoded. This whole
            section maps to dashboards.summary() / dashboards.timeline()
            already in services.js; see top-of-file wiring notes. */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            System Analytics Dashboard
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Platform-wide monitoring and performance metrics
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard icon={TrendingUp} label="Focal Users" value="142" />
            <StatCard icon={Users} label="Principal Users" value="18" />
            <StatCard icon={Users} label="Admin Users" value="5" />
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-5 mb-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Form Submission Tracking
                </p>
                <p className="text-xs text-gray-400">
                  Monthly submission rate over the tracking period
                </p>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                <TrendingUp size={15} />
                34.2%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-10 text-sm text-gray-500 shrink-0">JUL</span>
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full flex items-center justify-end px-3"
                  style={{ width: "34%" }}
                >
                  <span className="text-white text-xs font-medium">34.2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-100 bg-white p-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">Users</p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-gray-400">Registered Users</dt><dd className="font-medium text-gray-900">1,247</dd></div>
                <div className="flex justify-between"><dt className="text-gray-400">Focal Users</dt><dd className="font-medium text-gray-900">142</dd></div>
                <div className="flex justify-between"><dt className="text-gray-400">Principal Users</dt><dd className="font-medium text-gray-900">18</dd></div>
                <div className="flex justify-between"><dt className="text-gray-400">Admin Users</dt><dd className="font-medium text-gray-900">5</dd></div>
              </dl>
            </div>
            <div className="rounded-lg border border-gray-100 bg-white p-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">Forms</p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-gray-400">Forms Uploaded</dt><dd className="font-medium text-gray-900">142</dd></div>
                <div className="flex justify-between"><dt className="text-gray-400">Average Submission Rate</dt><dd className="font-medium text-gray-900">87.3%</dd></div>
                <div className="flex justify-between"><dt className="text-gray-400">Forms Disabled</dt><dd className="font-medium text-gray-900">6</dd></div>
                <div className="flex justify-between"><dt className="text-gray-400">Updates Uploaded</dt><dd className="font-medium text-gray-900">34</dd></div>
              </dl>
            </div>
            <div className="rounded-lg border border-gray-100 bg-white p-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">KPIs</p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-gray-400">KPIs Uploaded</dt><dd className="font-medium text-gray-900">89</dd></div>
                <div className="flex justify-between"><dt className="text-gray-400">KPIs Disabled</dt><dd className="font-medium text-gray-900">3</dd></div>
                <div className="flex justify-between"><dt className="text-gray-400">Updates Uploaded</dt><dd className="font-medium text-gray-900">21</dd></div>
                <div className="flex justify-between"><dt className="text-gray-400">Updates Disabled</dt><dd className="font-medium text-gray-900">2</dd></div>
              </dl>
            </div>
          </div>
        </section>

        {/* User Support Issues — already fully wired to the live
            students.feedback API via feedbackItems/feedbackLoading/
            feedbackError above. Use this section as the reference
            pattern for wiring the other placeholder sections. */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            User Support Issues
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Manage and respond to user-submitted support requests
          </p>

          <div className="mb-6">
            <div className="rounded-xl p-5 text-white bg-gradient-to-br from-brand to-brand-dark flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Total Issues Reported</p>
                <p className="text-3xl font-bold">{totalIssues}</p>
                <p className="text-xs opacity-80 mt-1">
                  {pendingIssues} pending · {resolvedIssues} resolved
                </p>
              </div>
              <Headphones size={40} className="opacity-30" />
            </div>
          </div>

          <AsyncState
            loading={feedbackLoading}
            error={feedbackError}
            empty={feedbackItems.length === 0}
            onRetry={refetchFeedback}
            loadingLabel="Loading support issues..."
            emptyLabel="No support issues reported yet."
          >
            {feedbackItems.map((item) => (
              <FeedbackCaseCard
                key={item.id}
                item={item}
                actions={["reply", "status", "delete"]}
                onUpdated={handleCaseUpdated}
                onDeleted={handleCaseDeleted}
              />
            ))}
          </AsyncState>
        </section>
      </main>

      <AdminFooter />
    </div>
  );
}
