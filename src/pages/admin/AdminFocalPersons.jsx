import { useCallback, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import CollapsibleSection from "../../components/admin/CollapsibleSection";
import ItemCard from "../../components/admin/ItemCard";
import ExpandableItemCard from "../../components/admin/ExpandableItemCard";
import FeedbackCaseCard from "../../components/dashboard/FeedbackCaseCard";
import UpdateModal from "../../components/admin/UpdateModal";
import AsyncState from "../../components/common/AsyncState";
import { useApiQuery } from "../../hooks/useApiResource";
import { getListItems } from "../../api/client";
import { auth, analytics } from "../../api/services";
import { formatLabel } from "../../lib/submissionMapper";
import { User, FileText, Plus } from "../../lib/icons";

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
    refetch: refetchUpdates,
  } = useApiQuery(useCallback(() => analytics.updates.list(), []));

  const allUsers = getListItems(usersResponse);
  const fpUsers = allUsers.filter(u => u?.status === FP_STATUS);

  const allUpdates = getListItems(updatesResponse);
  // Note: we assume focal_person updates have forUser as focal_person or empty for legacy ones,
  // but we enforce it tightly based on exactly "focal_person" to be safe.
  const fpUpdates = allUpdates.filter((u) => String(u?.forUser || "").toLowerCase() === "focal_person");

  const [fpFeedbackItems, setFpFeedbackItems] = useState([]);

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

        <CollapsibleSection
          title="FP Form Logs & Updates"
          subtitle={`Total: ${fpUpdates.length}`}
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
            empty={fpUpdates.length === 0}
            loadingLabel="Loading updates..."
            emptyLabel="No FP updates found."
          >
            {fpUpdates.map((u) => (
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

      <UpdateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveUpdate}
        forUser="focal_person"
        initialData={editingUpdate}
      />
    </AdminLayout>
  );
}
