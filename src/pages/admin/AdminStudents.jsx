import { useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import CollapsibleSection from "../../components/admin/CollapsibleSection";
import ItemCard from "../../components/admin/ItemCard";
import FeedbackCaseCard from "../../components/dashboard/FeedbackCaseCard";
import AsyncState from "../../components/common/AsyncState";
import { useApiQuery } from "../../hooks/useApiResource";
import { getListItems, replaceListItem, removeListItem } from "../../api/client";
import { students, auth } from "../../api/services";
import { mapFeedbackListForStaff, formatLabel } from "../../lib/submissionMapper";
import { User } from "../../lib/icons";

export default function AdminStudents() {
  const {
    data: usersResponse,
    loading: usersLoading,
    error: usersError,
  } = useApiQuery(useCallback(() => auth.users.all(), []));

  const {
    data: feedbackResponse,
    loading: feedbackLoading,
    error: feedbackError,
    refetch: refetchFeedback,
    setData: setFeedbackResponse,
  } = useApiQuery(useCallback(() => students.feedback.list(), []));

  const allUsers = getListItems(usersResponse);
  const studentUsers = allUsers.filter(u => u?.status === "student" || (!u.status && !u.is_superuser));

  const feedbackItems = mapFeedbackListForStaff(getListItems(feedbackResponse));

  const handleCaseUpdated = (updated) => {
    setFeedbackResponse((prev) => replaceListItem(prev, updated.id, updated));
  };

  const handleCaseDeleted = (id) => {
    setFeedbackResponse((prev) => removeListItem(prev, id));
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
    </AdminLayout>
  );
}
