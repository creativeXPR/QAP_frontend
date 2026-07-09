import { useCallback, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import CollapsibleSection from "../../components/admin/CollapsibleSection";
import ItemCard from "../../components/admin/ItemCard";
import ExpandableItemCard from "../../components/admin/ExpandableItemCard";
import FeedbackCaseCard from "../../components/dashboard/FeedbackCaseCard";
import UpdateModal from "../../components/admin/UpdateModal";
import AsyncState from "../../components/common/AsyncState";
import { useApiQuery } from "../../hooks/useApiResource";
import { getListItems, replaceListItem, removeListItem } from "../../api/client";
import { students, auth, analytics } from "../../api/services";
import { mapFeedbackListForStaff, formatLabel } from "../../lib/submissionMapper";
import { User, FileText, Plus } from "../../lib/icons";

export default function AdminStudents() {
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
    data: feedbackResponse,
    loading: feedbackLoading,
    error: feedbackError,
    refetch: refetchFeedback,
    setData: setFeedbackResponse,
  } = useApiQuery(useCallback(() => students.feedback.list(), []));

  const allUsers = getListItems(usersResponse);
  const studentUsers = allUsers.filter(u => u?.status === "student" || (!u.status && !u.is_superuser));

  const allUpdates = getListItems(updatesResponse);
  const studentUpdates = allUpdates.filter((u) => String(u?.forUser || "").toLowerCase() === "student");

  const feedbackItems = mapFeedbackListForStaff(getListItems(feedbackResponse));

  const handleCaseUpdated = (updated) => {
    setFeedbackResponse((prev) => replaceListItem(prev, updated.id, updated));
  };

  const handleCaseDeleted = (id) => {
    setFeedbackResponse((prev) => removeListItem(prev, id));
  };

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
    <AdminLayout title="Student Management">
      <div className="max-w-4xl mx-auto">
        <CollapsibleSection title="Student Users" subtitle={`Total: ${studentUsers.length}`}>
          <AsyncState
            loading={usersLoading}
            error={usersError}
            empty={studentUsers.length === 0}
            loadingLabel="Loading students..."
            emptyLabel="No student users found."
          >
            {studentUsers.map((u) => (
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
          title="Student Updates"
          subtitle={`Total: ${studentUpdates.length}`}
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
            empty={studentUpdates.length === 0}
            loadingLabel="Loading updates..."
            emptyLabel="No student updates found."
          >
            {studentUpdates.map((u) => (
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

        <CollapsibleSection title="Student Support Issues" subtitle={`Total issues reported: ${feedbackItems.length}`}>
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
        </CollapsibleSection>
      </div>

      <UpdateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveUpdate}
        forUser="student"
        initialData={editingUpdate}
      />
    </AdminLayout>
  );
}
