import { useCallback, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import CollapsibleSection from "../../components/admin/CollapsibleSection";
import ItemCard from "../../components/admin/ItemCard";
import ExpandableItemCard from "../../components/admin/ExpandableItemCard";
import FeedbackCaseCard from "../../components/dashboard/FeedbackCaseCard";
import UpdateModal from "../../components/admin/UpdateModal";
import KpiModal from "../../components/admin/KpiModal";
import AsyncState from "../../components/common/AsyncState";
import SearchFilterBar from "../../components/common/SearchFilterBar";
import { useApiQuery } from "../../hooks/useApiResource";
import { getListItems } from "../../api/client";
import { auth, analytics } from "../../api/services";
import { formatLabel } from "../../lib/submissionMapper";
import { User, FileText, ClipboardList, Plus } from "../../lib/icons";

const PO_STATUS = "principle_officer";
const ALL = "all";

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

  /* ---------------- PO Users filter ---------------- */

  const [userSearch, setUserSearch] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState(ALL);

  const filteredPoUsers = useMemo(() => {
    const query = userSearch.trim().toLowerCase();
    return poUsers.filter((u) => {
      const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || "";
      const matchesSearch = !query || name.toLowerCase().includes(query) || (u.email || "").toLowerCase().includes(query);
      const matchesStatus =
        userStatusFilter === ALL || (userStatusFilter === "active" ? u.is_active : !u.is_active);
      return matchesSearch && matchesStatus;
    });
  }, [poUsers, userSearch, userStatusFilter]);

  /* ---------------- PO KPI Library filter ---------------- */

  const [kpiSearch, setKpiSearch] = useState("");

  const filteredKpis = useMemo(() => {
    const query = kpiSearch.trim().toLowerCase();
    if (!query) return kpis;
    return kpis.filter(
      (k) =>
        (k.title || "").toLowerCase().includes(query) ||
        (k.description || "").toLowerCase().includes(query),
    );
  }, [kpis, kpiSearch]);

  /* ---------------- PO Updates filter ---------------- */

  const [updateSearch, setUpdateSearch] = useState("");
  const [updateCategoryFilter, setUpdateCategoryFilter] = useState(ALL);
  const [updateClassificationFilter, setUpdateClassificationFilter] = useState(ALL);

  const updateCategoryOptions = useMemo(() => {
    const unique = [...new Set(poUpdates.map((u) => formatLabel(u.category)).filter(Boolean))];
    return [ALL, ...unique];
  }, [poUpdates]);

  const updateClassificationOptions = useMemo(() => {
    const unique = [...new Set(poUpdates.map((u) => formatLabel(u.classification)).filter(Boolean))];
    return [ALL, ...unique];
  }, [poUpdates]);

  const filteredPoUpdates = useMemo(() => {
    const query = updateSearch.trim().toLowerCase();
    return poUpdates.filter((u) => {
      const matchesSearch = !query || (u.title || "").toLowerCase().includes(query);
      const matchesCategory = updateCategoryFilter === ALL || formatLabel(u.category) === updateCategoryFilter;
      const matchesClassification =
        updateClassificationFilter === ALL || formatLabel(u.classification) === updateClassificationFilter;
      return matchesSearch && matchesCategory && matchesClassification;
    });
  }, [poUpdates, updateSearch, updateCategoryFilter, updateClassificationFilter]);

  /* ---------------- PO Feedback & Requests filter ---------------- */

  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState(ALL);
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState(ALL);

  const feedbackCategoryOptions = useMemo(() => {
    const unique = [...new Set(poFeedbackItems.map((item) => item.category).filter(Boolean))];
    return [ALL, ...unique];
  }, [poFeedbackItems]);

  const filteredPoFeedbackItems = useMemo(() => {
    const query = feedbackSearch.trim().toLowerCase();
    return poFeedbackItems.filter((item) => {
      const matchesSearch =
        !query ||
        (item.studentName || "").toLowerCase().includes(query) ||
        (item.title || "").toLowerCase().includes(query);
      const matchesCategory = feedbackCategoryFilter === ALL || item.category === feedbackCategoryFilter;
      const matchesStatus = feedbackStatusFilter === ALL || item.rawStatus === feedbackStatusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [poFeedbackItems, feedbackSearch, feedbackCategoryFilter, feedbackStatusFilter]);

  return (
    <AdminLayout title="Principal Officer Management">
      <div className="max-w-6xl mx-auto">
        <CollapsibleSection
          title="Principal Officer Users"
          subtitle={`Total: ${poUsers.length}`}
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
            empty={filteredPoUsers.length === 0}
            loadingLabel="Loading users..."
            emptyLabel={poUsers.length === 0 ? "No PO users found." : "No results match your filters."}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPoUsers.map((u) => (
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
          filterNode={
            <SearchFilterBar
              searchValue={kpiSearch}
              onSearchChange={setKpiSearch}
              searchPlaceholder="Search by title or description..."
            />
          }
        >
          <AsyncState
            loading={kpisLoading}
            error={kpisError}
            empty={filteredKpis.length === 0}
            loadingLabel="Loading KPIs..."
            emptyLabel={kpis.length === 0 ? "No KPIs found." : "No results match your filters."}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredKpis.map((k) => (
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
            </div>
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
            empty={filteredPoUpdates.length === 0}
            loadingLabel="Loading updates..."
            emptyLabel={poUpdates.length === 0 ? "No PO updates found." : "No results match your filters."}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPoUpdates.map((u) => (
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
          title="PO Feedback & Requests"
          subtitle={`Total issues: ${poFeedbackItems.length}`}
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
            empty={filteredPoFeedbackItems.length === 0}
            loadingLabel="Loading..."
            emptyLabel={poFeedbackItems.length === 0 ? "No PO feedback reported yet." : "No results match your filters."}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPoFeedbackItems.map((item) => (
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
