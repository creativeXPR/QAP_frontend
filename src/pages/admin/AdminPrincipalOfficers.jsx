import { useCallback, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import CollapsibleSection from "../../components/admin/CollapsibleSection";
import ItemCard from "../../components/admin/ItemCard";
import ExpandableItemCard from "../../components/admin/ExpandableItemCard";
import FeedbackCaseCard from "../../components/dashboard/FeedbackCaseCard";
import UpdateModal from "../../components/admin/UpdateModal";
import KpiModal from "../../components/admin/KpiModal";
import AsyncState from "../../components/common/AsyncState";
import { useApiQuery } from "../../hooks/useApiResource";
import { getListItems } from "../../api/client";
import { auth, analytics } from "../../api/services";
import { formatLabel } from "../../lib/submissionMapper";
import { User, FileText, ClipboardList, Plus } from "../../lib/icons";

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
    refetch: refetchUpdates,
  } = useApiQuery(useCallback(() => analytics.updates.list(), []));

  const {
    data: kpisResponse,
    loading: kpisLoading,
    error: kpisError,
    refetch: refetchKpis,
  } = useApiQuery(useCallback(() => analytics.kpis.list(), []));

  const allUsers = getListItems(usersResponse);
  const poUsers = allUsers.filter(u => u?.status === PO_STATUS);

  const allUpdates = getListItems(updatesResponse);
  const poUpdates = allUpdates.filter((u) => String(u?.forUser || "").toLowerCase() === "principal_officer" || String(u?.forUser || "").toLowerCase() === "po");

  const kpis = getListItems(kpisResponse);

  const [poFeedbackItems, setPoFeedbackItems] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);

  const handleSaveUpdate = async (payload, id) => {
    if (id) {
      await analytics.updates.partialUpdate(id, payload);
    } else {
      await analytics.updates.create(payload);
    }
    refetchUpdates();
  };

  const handleDeleteUpdate = async (item) => {
    await analytics.updates.remove(item.id);
    refetchUpdates();
  };

  const openAddModal = () => {
    setEditingUpdate(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingUpdate(item);
    setModalOpen(true);
  };

  const [kpiModalOpen, setKpiModalOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState(null);

  const handleSaveKpi = async (payload, id) => {
    if (id) {
      await analytics.kpis.partialUpdate(id, payload);
    } else {
      await analytics.kpis.create(payload);
    }
    refetchKpis();
  };

  const openAddKpiModal = () => {
    setEditingKpi(null);
    setKpiModalOpen(true);
  };

  const openEditKpiModal = (kpi) => {
    setEditingKpi(kpi);
    setKpiModalOpen(true);
  };

  const handleDeleteKpi = async (kpi) => {
    await analytics.kpis.remove(kpi.id);
    refetchKpis();
  };

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

        <CollapsibleSection
          title="PO KPI Library"
          subtitle={`Total: ${kpis.length}`}
          actionNode={
            <button
              onClick={openAddKpiModal}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-brand/10 text-brand hover:bg-brand hover:text-white transition-colors"
              title="Add New KPI"
            >
              <Plus size={18} />
            </button>
          }
        >
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
                onEdit={() => openEditKpiModal(k)}
                onDelete={() => handleDeleteKpi(k)}
              />
            ))}
          </AsyncState>
        </CollapsibleSection>

        <CollapsibleSection
          title="PO Updates"
          subtitle={`Total: ${poUpdates.length}`}
          actionNode={
            <button
              onClick={openAddModal}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-brand/10 text-brand hover:bg-brand hover:text-white transition-colors"
              title="Upload New Update"
            >
              <Plus size={18} />
            </button>
          }
        >
          <AsyncState
            loading={updatesLoading}
            error={updatesError}
            empty={poUpdates.length === 0}
            loadingLabel="Loading updates..."
            emptyLabel="No PO updates found."
          >
            {poUpdates.map((u) => (
              <ExpandableItemCard
                key={u.id}
                item={u}
                icon={FileText}
                title={u.title}
                badge={formatLabel(u.category)}
                badgeColor="bg-brand/10 text-brand"
                subtitle={`Classification: ${formatLabel(u.classification)}`}
                onEdit={openEditModal}
                onDelete={handleDeleteUpdate}
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

      <UpdateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveUpdate}
        forUser="principal_officer"
        initialData={editingUpdate}
      />

      <KpiModal
        isOpen={kpiModalOpen}
        onClose={() => setKpiModalOpen(false)}
        onSave={handleSaveKpi}
        initialData={editingKpi}
      />
    </AdminLayout>
  );
}
