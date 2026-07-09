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
import { User, FileText, ClipboardList } from "../../lib/icons";

const PO_STATUS = "po";

export default function AdminPrincipalOfficers() {
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

  const allUsers = getListItems(usersResponse);
  const poUsers = allUsers.filter(u => u?.status === PO_STATUS);

  const allUpdates = getListItems(updatesResponse);
  const poUpdates = allUpdates.filter((u) => String(u?.forUser || "").toLowerCase() === "po");

  const kpis = getListItems(kpisResponse);

  // Dummy state to mock the PO feedback/requests since it doesn't have an endpoint yet
  const [poFeedbackItems, setPoFeedbackItems] = useState([]);

  return (
    <AdminLayout title="Principal Officer Management">
      <div className="max-w-4xl mx-auto">
        <CollapsibleSection title="Principal Officer Users" subtitle={`Total: ${poUsers.length}`}>
          <AsyncState
            loading={usersLoading}
            error={usersError}
            empty={poUsers.length === 0}
            loadingLabel="Loading users..."
            emptyLabel="No PO users found."
          >
            {poUsers.map((u) => (
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

        <CollapsibleSection title="PO KPI Library" subtitle={`Total: ${kpis.length}`}>
          <AsyncState
            loading={kpisLoading}
            error={kpisError}
            empty={kpis.length === 0}
            loadingLabel="Loading KPIs..."
            emptyLabel="No KPIs found."
          >
            {kpis.map((k) => (
              <ItemCard
                key={k.id}
                icon={ClipboardList}
                title={k.title}
                subtitle={k.description}
                badge={`Responses: ${k.metrics?.total_responses ?? "—"}`}
                badgeColor="bg-amber-50 text-amber-600"
                meta={`Rating: ${k.metrics?.rating ?? "—"}`}
              />
            ))}
          </AsyncState>
        </CollapsibleSection>

        <CollapsibleSection title="PO Updates" subtitle={`Total: ${poUpdates.length}`}>
          <AsyncState
            loading={updatesLoading}
            error={updatesError}
            empty={poUpdates.length === 0}
            loadingLabel="Loading updates..."
            emptyLabel="No PO updates found."
          >
            {poUpdates.map((u) => (
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

        <CollapsibleSection title="PO Feedback & Requests" subtitle={`Total issues: ${poFeedbackItems.length}`}>
          <AsyncState
            loading={false}
            error={null}
            empty={poFeedbackItems.length === 0}
            loadingLabel="Loading..."
            emptyLabel="No PO feedback reported yet."
          >
            {poFeedbackItems.map((item) => (
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
