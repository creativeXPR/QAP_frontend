import { useCallback, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import CollapsibleSection from "../../components/admin/CollapsibleSection";
import ItemCard from "../../components/admin/ItemCard";
import FeedbackCaseCard from "../../components/dashboard/FeedbackCaseCard";
import AsyncState from "../../components/common/AsyncState";
import { useApiQuery } from "../../hooks/useApiResource";
import { getListItems } from "../../api/client";
import { auth, analytics } from "../../api/services";
import { formatLabel } from "../../lib/submissionMapper";
import { User, FileText } from "../../lib/icons";

const FP_STATUS = "focal_person";

export default function AdminFocalPersons() {
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

  const allUsers = getListItems(usersResponse);
  const fpUsers = allUsers.filter(u => u?.status === FP_STATUS);

  const allUpdates = getListItems(updatesResponse);
  const fpUpdates = allUpdates.filter((u) => String(u?.forUser || "").toLowerCase() !== "po");

  // Dummy state to mock the FP feedback/complaints since it doesn't have an endpoint yet
  // but we want it ready.
  const [fpFeedbackItems, setFpFeedbackItems] = useState([]);

  return (
    <AdminLayout title="Focal Person Management">
      <div className="max-w-4xl mx-auto">
        <CollapsibleSection title="Focal Person Users" subtitle={`Total: ${fpUsers.length}`}>
          <AsyncState
            loading={usersLoading}
            error={usersError}
            empty={fpUsers.length === 0}
            loadingLabel="Loading users..."
            emptyLabel="No FP users found."
          >
            {fpUsers.map((u) => (
              <ItemCard
                key={u.id}
                icon={User}
                title={[u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || "—"}
                subtitle={u.email}
                badge={u.is_active ? "Active" : "Inactive"}
                badgeColor={u.is_active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}
              />
            ))}
          </AsyncState>
        </CollapsibleSection>

        <CollapsibleSection title="FP Form Logs & Updates" subtitle={`Total: ${fpUpdates.length}`}>
          <AsyncState
            loading={updatesLoading}
            error={updatesError}
            empty={fpUpdates.length === 0}
            loadingLabel="Loading updates..."
            emptyLabel="No FP updates found."
          >
            {fpUpdates.map((u) => (
              <ItemCard
                key={u.id}
                icon={FileText}
                title={u.title}
                badge={formatLabel(u.category)}
                badgeColor="bg-brand/10 text-brand"
                subtitle={`Classification: ${formatLabel(u.classification)}`}
              />
            ))}
          </AsyncState>
        </CollapsibleSection>

        <CollapsibleSection title="FP Feedback & Requests" subtitle={`Total issues: ${fpFeedbackItems.length}`}>
          <AsyncState
            loading={false}
            error={null}
            empty={fpFeedbackItems.length === 0}
            loadingLabel="Loading..."
            emptyLabel="No FP feedback reported yet."
          >
            {fpFeedbackItems.map((item) => (
              <FeedbackCaseCard
                key={item.id}
                item={item}
                actions={["reply", "status", "delete"]}
                onUpdated={() => {}}
                onDeleted={() => {}}
              />
            ))}
          </AsyncState>
        </CollapsibleSection>
      </div>
    </AdminLayout>
  );
}
