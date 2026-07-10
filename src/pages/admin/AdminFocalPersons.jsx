import { useCallback, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import CollapsibleSection from "../../components/admin/CollapsibleSection";
import ItemCard from "../../components/admin/ItemCard";
import ExpandableItemCard from "../../components/admin/ExpandableItemCard";
import FeedbackCaseCard from "../../components/dashboard/FeedbackCaseCard";
import UpdateModal from "../../components/admin/UpdateModal";
import AsyncState from "../../components/common/AsyncState";
import SearchFilterBar from "../../components/common/SearchFilterBar";
import { useApiQuery } from "../../hooks/useApiResource";
import { getListItems } from "../../api/client";
import { auth, analytics } from "../../api/services";
import { formatLabel } from "../../lib/submissionMapper";
import { User, FileText, Plus } from "../../lib/icons";

const FP_STATUS = "focal_person";
const ALL = "all";

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

  /* ---------------- FP Users filter ---------------- */

  const [userSearch, setUserSearch] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState(ALL);

  const filteredFpUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    return fpUsers.filter((u) => {
      const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || "";
      const matchesSearch = !query || name.toLowerCase().includes(query) || (u.email || "").toLowerCase().includes(query);
      const matchesStatus =
        userStatusFilter === ALL || (userStatusFilter === "active" ? u.is_active : !u.is_active);
      return matchesSearch && matchesStatus;
    });
  }, [fpUsers, userSearch, userStatusFilter]);

  /* ---------------- FP Updates filter ---------------- */

  const [updateSearch, setUpdateSearch] = useState("");
  const [updateCategoryFilter, setUpdateCategoryFilter] = useState(ALL);
  const [updateClassificationFilter, setUpdateClassificationFilter] = useState(ALL);

  const updateCategoryOptions = useMemo(() => {
    const unique = [...new Set(fpUpdates.map((u) => formatLabel(u.category)).filter(Boolean))];
    return [ALL, ...unique];
  }, [fpUpdates]);

  const updateClassificationOptions = useMemo(() => {
    const unique = [...new Set(fpUpdates.map((u) => formatLabel(u.classification)).filter(Boolean))];
    return [ALL, ...unique];
  }, [fpUpdates]);

  const filteredFpUpdates = useMemo(() => {
    const query = updateSearch.trim().toLowerCase();
    return fpUpdates.filter((u) => {
      const matchesSearch = !query || (u.title || "").toLowerCase().includes(query);
      const matchesCategory = updateCategoryFilter === ALL || formatLabel(u.category) === updateCategoryFilter;
      const matchesClassification =
        updateClassificationFilter === ALL || formatLabel(u.classification) === updateClassificationFilter;
      return matchesSearch && matchesCategory && matchesClassification;
    });
  }, [fpUpdates, updateSearch, updateCategoryFilter, updateClassificationFilter]);

  /* ---------------- FP Feedback & Requests filter ---------------- */

  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState(ALL);
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState(ALL);

  const feedbackCategoryOptions = useMemo(() => {
    const unique = [...new Set(fpFeedbackItems.map((item) => item.category).filter(Boolean))];
    return [ALL, ...unique];
  }, [fpFeedbackItems]);

  const filteredFpFeedbackItems = useMemo(() => {
    const query = feedbackSearch.trim().toLowerCase();
    return fpFeedbackItems.filter((item) => {
      const matchesSearch =
        !query ||
        (item.studentName || "").toLowerCase().includes(query) ||
        (item.title || "").toLowerCase().includes(query);
      const matchesCategory = feedbackCategoryFilter === ALL || item.category === feedbackCategoryFilter;
      const matchesStatus = feedbackStatusFilter === ALL || item.rawStatus === feedbackStatusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [fpFeedbackItems, feedbackSearch, feedbackCategoryFilter, feedbackStatusFilter]);

  return (
    <AdminLayout title="Focal Person Management">
      <div className="max-w-6xl mx-auto">
        <CollapsibleSection
          title="Focal Person Users"
          subtitle={`Total: ${fpUsers.length}`}
          filterNode={
            <SearchFilterBar
              searchValue={userSearch}
              onSearchChange={setUserSearch}
              searchPlaceholder="Search by name or email..."
              filters={[
                {
                  value: userStatusFilter,
                  onChange: setUserStatusFilter,
                  options: [
                    { value: ALL, label: "All Status" },
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ],
                },
              ]}
            />
          }
        >
          <AsyncState
            loading={usersLoading}
            error={usersError}
            empty={filteredFpUsers.length === 0}
            loadingLabel="Loading users..."
            emptyLabel={fpUsers.length === 0 ? "No FP users found." : "No results match your filters."}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredFpUsers.map((u) => (
                <ItemCard
                  key={u.id}
                  icon={User}
                  title={[u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || "—"}
                  subtitle={u.email}
                  badge={u.is_active ? "Active" : "Inactive"}
                  badgeColor={u.is_active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}
                />
              ))}
            </div>
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
          filterNode={
            <SearchFilterBar
              searchValue={updateSearch}
              onSearchChange={setUpdateSearch}
              searchPlaceholder="Search by title..."
              filters={[
                {
                  value: updateCategoryFilter,
                  onChange: setUpdateCategoryFilter,
                  options: updateCategoryOptions.map((opt) => ({
                    value: opt,
                    label: opt === ALL ? "All Categories" : opt,
                  })),
                },
                {
                  value: updateClassificationFilter,
                  onChange: setUpdateClassificationFilter,
                  options: updateClassificationOptions.map((opt) => ({
                    value: opt,
                    label: opt === ALL ? "All Classifications" : opt,
                  })),
                },
              ]}
            />
          }
        >
          <AsyncState
            loading={updatesLoading}
            error={updatesError}
            empty={filteredFpUpdates.length === 0}
            loadingLabel="Loading updates..."
            emptyLabel={fpUpdates.length === 0 ? "No FP updates found." : "No results match your filters."}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredFpUpdates.map((u) => (
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
            </div>
          </AsyncState>
        </CollapsibleSection>

        <CollapsibleSection
          title="FP Feedback & Requests"
          subtitle={`Total issues: ${fpFeedbackItems.length}`}
          filterNode={
            <SearchFilterBar
              searchValue={feedbackSearch}
              onSearchChange={setFeedbackSearch}
              searchPlaceholder="Search by student name or title..."
              filters={[
                {
                  value: feedbackCategoryFilter,
                  onChange: setFeedbackCategoryFilter,
                  options: feedbackCategoryOptions.map((opt) => ({
                    value: opt,
                    label: opt === ALL ? "All Categories" : opt,
                  })),
                },
                {
                  value: feedbackStatusFilter,
                  onChange: setFeedbackStatusFilter,
                  options: [
                    { value: ALL, label: "All Status" },
                    { value: "pending", label: "Pending" },
                    { value: "resolved", label: "Resolved" },
                  ],
                },
              ]}
            />
          }
        >
          <AsyncState
            loading={false}
            error={null}
            empty={filteredFpFeedbackItems.length === 0}
            loadingLabel="Loading..."
            emptyLabel={fpFeedbackItems.length === 0 ? "No FP feedback reported yet." : "No results match your filters."}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredFpFeedbackItems.map((item) => (
                <FeedbackCaseCard
                  key={item.id}
                  item={item}
                  actions={["reply", "status", "delete"]}
                  onUpdated={() => {}}
                  onDeleted={() => {}}
                />
              ))}
            </div>
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
