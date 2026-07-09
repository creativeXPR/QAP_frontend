import { useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import StatCard from "../../components/dashboard/StatCard";
import AsyncState from "../../components/common/AsyncState";
import { useApiQuery } from "../../hooks/useApiResource";
import { getListItems } from "../../api/client";
import { students, auth, analytics } from "../../api/services";
import { mapFeedbackListForStaff } from "../../lib/submissionMapper";
import {
  Users,
  TrendingUp,
  FileText,
} from "../../lib/icons";

const ADMIN_STATUS = "admin";
const PO_STATUS = "po";
const FP_STATUS = "focal_person";

const isAdminUser = (u) => u?.status === ADMIN_STATUS;
const isPoUser = (u) => u?.status === PO_STATUS;
const isFpUser = (u) => u?.status === FP_STATUS;

export default function AdminDashboard() {
  const {
    data: feedbackResponse,
    loading: feedbackLoading,
    error: feedbackError,
  } = useApiQuery(useCallback(() => students.feedback.list(), []));

  const {
    data: usersResponse,
    loading: usersLoading,
    error: usersError,
  } = useApiQuery(useCallback(() => auth.users.all(), []));

  const {
    data: updatesResponse,
    loading: updatesLoading,
    error: updatesError,
  } = useApiQuery(useCallback(() => analytics.updates.list(), []));

  const {
    data: kpisResponse,
    loading: kpisLoading,
    error: kpisError,
  } = useApiQuery(useCallback(() => analytics.kpis.list(), []));

  const feedbackItems = mapFeedbackListForStaff(getListItems(feedbackResponse));
  const totalIssues = feedbackItems.length;

  const allUsers = getListItems(usersResponse);
  const registeredUsersCount = allUsers.length;
  const focalUsersCount = allUsers.filter(isFpUser).length;
  const principalUsersCount = allUsers.filter(isPoUser).length;
  const adminUsersCount = allUsers.filter(isAdminUser).length;

  const allUpdates = getListItems(updatesResponse);
  const poUpdatesCount = allUpdates.filter((u) => String(u?.forUser || "").toLowerCase() === "po").length;
  const nonPoUpdatesCount = allUpdates.length - poUpdatesCount;

  const kpisCount = getListItems(kpisResponse).length;

  const overallLoading = feedbackLoading || usersLoading || updatesLoading || kpisLoading;
  const overallError = feedbackError || usersError || updatesError || kpisError;

  return (
    <AdminLayout title="System Overview">
      <AsyncState
        loading={overallLoading}
        error={overallError}
        loadingLabel="Loading system overview..."
      >
        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Platform Monitor</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Users}
                label="Registered Users"
                value={registeredUsersCount.toLocaleString()}
                variant="overview"
              />
              <StatCard
                icon={TrendingUp}
                label="Total Submissions"
                value={totalIssues.toLocaleString()}
                variant="overview"
              />
              <StatCard
                icon={FileText}
                label="KPIs Active"
                value={kpisCount.toLocaleString()}
                variant="overview"
              />
              <StatCard
                icon={FileText}
                label="Active Forms"
                value={nonPoUpdatesCount.toLocaleString()}
                variant="overview"
              />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">User Roles Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard icon={TrendingUp} label="Focal Users" value={focalUsersCount} />
              <StatCard icon={Users} label="Principal Users" value={principalUsersCount} />
              <StatCard icon={Users} label="Admin Users" value={adminUsersCount} />
            </div>
          </section>
        </div>
      </AsyncState>
    </AdminLayout>
  );
}
