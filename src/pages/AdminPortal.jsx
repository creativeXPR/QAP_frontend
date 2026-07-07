import AdminTopNav from "../components/layout/AdminTopNav";
import AdminFooter from "../components/layout/AdminFooter";
import StatCard from "../components/dashboard/StatCard";
import DataTable from "../components/dashboard/DataTable";
import ProgressBarList from "../components/dashboard/ProgressBarList";
import {
  Users,
  FileText,
  Activity,
  Layers,
  UploadCloud,
  Trash2,
  TrendingUp,
  Eye,
} from "lucide-react";

const OVERVIEW_STATS = [
  { label: "Active Users", value: "1,247", icon: Users, trend: "Stable" },
  { label: "Submission Counts", value: "3,854", icon: FileText, trend: "Stable" },
  { label: "System Health", value: "Stable", icon: Activity, trend: "Stable" },
  { label: "Total Forms", value: "142", icon: Layers, trend: "Stable" },
  { label: "KPI Templates", value: "89", icon: Layers, trend: "Stable" },
];

const FORM_LIBRARY_COLUMNS = [
  { key: "title", label: "Form Title" },
  { key: "category", label: "Category", type: "badge" },
  { key: "status", label: "Status", type: "badge" },
  { key: "dateUploaded", label: "Date Uploaded" },
  { key: "submissions", label: "Submissions" },
];

const FORM_LIBRARY_ROWS = [
  {
    title: "Course Evaluation Form",
    category: "Academic",
    status: "Active",
    dateUploaded: "2026-01-15",
    submissions: 340,
  },
  {
    title: "Faculty Research Output Assessment",
    category: "Academic",
    status: "Active",
    dateUploaded: "2025-07-15",
    submissions: 127,
  },
  {
    title: "Department Resource Allocation",
    category: "Administrative",
    status: "Active",
    dateUploaded: "2026-01-15",
    submissions: 68,
  },
  {
    title: "Student Feedback Survey",
    category: "Academic",
    status: "Draft",
    dateUploaded: "2026-01-15",
    submissions: 0,
  },
];

const FP_USER_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "department", label: "Department / Unit" },
  { key: "email", label: "Email" },
  { key: "permissions", label: "Permissions", type: "badge" },
];

const FP_USER_ROWS = [
  {
    name: "Dr. Adewale Ogunleye",
    department: "Computer Science",
    email: "a.ogunleye@ui.edu.ng",
    permissions: "Edit & Submit",
  },
  {
    name: "Prof. Chinyere Nwosu",
    department: "Medicine & Surgery",
    email: "c.nwosu@ui.edu.ng",
    permissions: "Edit & Submit",
  },
  {
    name: "Dr. Ibrahim Lawal",
    department: "Chemistry",
    email: "i.lawal@ui.edu.ng",
    permissions: "View Only",
  },
  {
    name: "Prof. Folake Adeleke",
    department: "Political Science",
    email: "f.adeleke@ui.edu.ng",
    permissions: "View Only",
  },
];

const PO_USER_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "office", label: "Office / Unit" },
  { key: "email", label: "Email" },
  { key: "accessLevel", label: "Data Access Level", type: "badge" },
];

const PO_USER_ROWS = [
  {
    name: "Prof. Oluwaseun Ajayi",
    office: "Vice Chancellor's Office",
    email: "o.ajayi@ui.edu.ng",
    accessLevel: "University-wide",
  },
  {
    name: "Dr. Ngozi Okafor",
    office: "Academic Planning Unit",
    email: "n.okafor@ui.edu.ng",
    accessLevel: "Academic View",
  },
  {
    name: "Mr. Tunde Babatunde",
    office: "Registry",
    email: "t.babatunde@ui.edu.ng",
    accessLevel: "Administrative View",
  },
  {
    name: "Mrs. Aisha Mohammed",
    office: "Quality Assurance Unit",
    email: "a.mohammed@ui.edu.ng",
    accessLevel: "University-wide",
  },
];

const KPI_LIBRARY_COLUMNS = [
  { key: "name", label: "KPI Name" },
  { key: "category", label: "Category", type: "badge" },
  { key: "status", label: "Status", type: "badge" },
  { key: "lastUploaded", label: "Last Uploaded" },
];

const KPI_LIBRARY_ROWS = [
  {
    name: "Student Graduation Rate",
    category: "Academic",
    status: "Active",
    lastUploaded: "2026-01-15",
  },
  {
    name: "Budget Utilization Efficiency",
    category: "Administrative",
    status: "Active",
    lastUploaded: "2026-01-15",
  },
  {
    name: "Staff Development Programs",
    category: "Administrative",
    status: "Under Review",
    lastUploaded: "2026-01-15",
  },
];

const ACTIVITY_LOG = [
  {
    name: "Prof. Oluwaseun Ajayi",
    action: "Generated Annual Report",
    time: "2026-01-15 08:24 AM",
  },
  {
    name: "Dr. Ngozi Okafor",
    action: "Viewed Academic KPI Dashboard",
    time: "2026-01-15 09:34 AM",
  },
  {
    name: "Mrs. Aisha Mohammed",
    action: "Exported Compliance Report",
    time: "2026-01-15 09:34 AM",
  },
  {
    name: "Mr. Tunde Babatunde",
    action: "Accessed Budget Analysis",
    time: "2026-01-15 09:34 AM",
  },
];

const ANALYTICS_STATS = [
  {
    label: "Real-time Visitors",
    value: "47",
    caption: "Active now",
    icon: Activity,
  },
  {
    label: "Active Users Online",
    value: "128",
    caption: "Logged in users",
    icon: Users,
  },
  {
    label: "KPI Viewership",
    value: "2,847",
    caption: "views this month",
    icon: Eye,
  },
  {
    label: "System Performance",
    value: "98.7%",
    caption: "Uptime this month",
    trend: "Healthy",
    icon: Activity,
  },
];

const SUBMISSION_TRACKING = [
  { label: "Aug", value: 245 },
  { label: "Sep", value: 345 },
  { label: "Oct", value: 312 },
  { label: "Nov", value: 388 },
  { label: "Dec", value: 423 },
];

const SYSTEM_METRICS = [
  {
    title: "Database Performance",
    rows: [
      ["Query Time (avg)", "24ms"],
      ["Connection Pool", "67%"],
      ["Cache Hit Rate", "94.2%"],
    ],
  },
  {
    title: "API Response Times",
    rows: [
      ["Forms API", "124ms"],
      ["KPI API", "156ms"],
      ["Analytics API", "234ms"],
    ],
  },
  {
    title: "Storage & Resources",
    rows: [
      ["Storage Used", "343 GB"],
      ["Bandwidth Growth", "187 GB"],
      ["Memory Usage", "84.2%"],
    ],
  },
];

function SectionHeaderButtons({ uploadLabel, deleteLabel }) {
  if (!uploadLabel && !deleteLabel) return null;
  return (
    <div className="flex gap-3">
      {uploadLabel && (
        <button className="flex items-center gap-2 text-sm font-medium bg-brand hover:bg-brand-dark text-white px-5 py-2.5 rounded-lg">
          <UploadCloud size={15} />
          {uploadLabel}
        </button>
      )}
      {deleteLabel && (
        <button className="flex items-center gap-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg">
          <Trash2 size={15} />
          {deleteLabel}
        </button>
      )}
    </div>
  );
}

function SectionHeader({ title, uploadLabel, deleteLabel }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <SectionHeaderButtons uploadLabel={uploadLabel} deleteLabel={deleteLabel} />
    </div>
  );
}

export default function AdminPortal() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminTopNav
        tabs={["FP Management", "PO Management", "Profile", "System Settings"]}
        activeTab="FP Management"
        portalLabel="Admin Portal"
      />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
        {/* System overview */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            System Overview
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Real-time platform monitoring and statistics
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {OVERVIEW_STATS.map((s) => (
              <StatCard key={s.label} {...s} variant="overview" />
            ))}
          </div>
        </section>

        {/* FP Management */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                FP Management
              </h2>
              <p className="text-xs text-gray-400">
                Manage Focal Person forms and user accounts
              </p>
            </div>
            <SectionHeaderButtons
              uploadLabel="Upload New Forms/Templates"
              deleteLabel="Delete"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <StatCard
              icon={TrendingUp}
              label="Submission Rates"
              value="87.3%"
              caption="Average completion rate across all forms"
            />
            <StatCard
              icon={TrendingUp}
              label="Completion Statistics"
              value="558 / 640"
              caption="Forms completed this month"
            />
          </div>

          <SectionHeader title="Form Library" />
          <div className="mb-6">
            <DataTable
              columns={FORM_LIBRARY_COLUMNS}
              rows={FORM_LIBRARY_ROWS}
              actions={["view", "edit", "delete"]}
            />
          </div>

          <SectionHeader title="FP User Management" />
          <DataTable
            columns={FP_USER_COLUMNS}
            rows={FP_USER_ROWS}
            actions={["view", "edit", "delete"]}
          />
        </section>

        {/* PO Management */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                PO Management
              </h2>
              <p className="text-xs text-gray-400">
                Manage Principal Officer templates and user accounts
              </p>
            </div>
            <SectionHeaderButtons
              uploadLabel="Upload New KPI Templates"
              deleteLabel="Delete"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <StatCard
              icon={FileText}
              label="Report Generation Count"
              value="284"
              caption="Reports generated this month"
            />
            <StatCard
              icon={TrendingUp}
              label="Completion Statistics"
              value="1,432"
              caption="Access records recorded this month"
            />
          </div>

          <SectionHeader title="KPI Library" />
          <div className="mb-6">
            <DataTable
              columns={KPI_LIBRARY_COLUMNS}
              rows={KPI_LIBRARY_ROWS}
              actions={["view", "edit", "delete"]}
            />
          </div>

          <SectionHeader title="PO User Management" />
          <div className="mb-6">
            <DataTable
              columns={PO_USER_COLUMNS}
              rows={PO_USER_ROWS}
              actions={["view", "edit", "delete"]}
            />
          </div>

          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Recent Activity
          </h3>
          <DataTable
            columns={[
              { key: "name", label: "Name" },
              { key: "action", label: "Action" },
              { key: "time", label: "Timestamp" },
            ]}
            rows={ACTIVITY_LOG}
          />
        </section>

        {/* System analytics */}
        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">
              System Analytics Dashboard
            </h2>
            <p className="text-xs text-gray-400">
              Platform-wide monitoring and performance metrics
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {ANALYTICS_STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <ProgressBarList
            title="Form Submission Tracking"
            subtitle="Monthly submission trends over last 6 months"
            trend="+18.4%"
            data={SUBMISSION_TRACKING}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {SYSTEM_METRICS.map((metric) => (
              <div
                key={metric.title}
                className="rounded-lg border border-gray-100 p-4"
              >
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  {metric.title}
                </p>
                <dl className="space-y-2.5 text-sm">
                  {metric.rows.map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between">
                      <dt className="text-gray-400">{label}</dt>
                      <dd className="font-medium text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>

        <AdminFooter />
      </main>
    </div>
  );
}