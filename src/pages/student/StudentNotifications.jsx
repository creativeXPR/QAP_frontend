import { useCallback, useMemo } from "react";
import StudentLayout from "../../components/student/StudentLayout";
import AsyncState from "../../components/common/AsyncState";
import { RefreshCcw, CheckCircle2 } from "../../lib/icons";
import { getListItems } from "../../api/client";
import { students } from "../../api/services";
import { useApiQuery } from "../../hooks/useApiResource";

const TYPE_STYLES = {
  review: { icon: RefreshCcw, className: "bg-blue-50 text-blue-500" },
  resolved: { icon: CheckCircle2, className: "bg-emerald-50 text-emerald-600" },
};

// NOTE: only "complaint_update" was previously handled (mapped to
// "review"), and everything else silently fell through to "review"
// too — meaning the green "resolved" style could never actually
// render. Added "complaint_resolved" as the resolved case; this is a
// guess at the real backend enum value since it wasn't documented
// anywhere I have access to — confirm against the actual
// notification_type values the API returns and adjust if wrong.
function resolveNotificationType(rawType) {
  if (rawType === "complaint_resolved") return "resolved";
  if (rawType === "complaint_update") return "review";
  return "review";
}

function mapNotification(item) {
  const createdAt = item?.created_at ? new Date(item.created_at) : null;

  return {
    id: item.id,
    type: resolveNotificationType(item.notification_type),
    title: item.title,
    description: item.message,
    date: createdAt ? createdAt.toISOString().slice(0, 10) : "",
    time: createdAt
      ? createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "",
    read: Boolean(item.is_read),
  };
}

export default function StudentNotifications() {
  const { data, loading, error, refetch, setData } = useApiQuery(
    useCallback(() => students.notifications.list(), []),
  );

  const notifications = useMemo(
    () => getListItems(data).map(mapNotification),
    [data],
  );
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;

    // Optimistic update: flip is_read on the underlying raw items so
    // the mapped `notifications` list (derived from `data`) reflects
    // it immediately, without waiting on the network calls below.
    const items = getListItems(data).map((item) =>
      unread.some((n) => n.id === item.id) ? { ...item, is_read: true } : item,
    );
    setData(Array.isArray(data) ? items : { ...data, results: items });

    try {
      await Promise.all(unread.map((n) => students.notifications.markRead(n.id)));
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
      refetch();
    }
  };

  return (
    <StudentLayout sessionLabel="2025/2026 Session">
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 md:p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-400">{unreadCount} Unread</p>
          </div>
          <button
            onClick={markAllAsRead}
            className="text-sm text-gray-500 hover:text-brand"
          >
            Mark all as read
          </button>
        </div>

        <div className="space-y-3">
          <AsyncState
            loading={loading}
            error={error}
            empty={notifications.length === 0}
            onRetry={refetch}
            loadingLabel="Loading notifications..."
            emptyLabel="No notifications found."
          >
            {notifications.map((n) => {
              const { icon: Icon, className } = TYPE_STYLES[n.type] || TYPE_STYLES.review;
              return (
                <div
                  key={n.id}
                  className="flex items-start justify-between gap-3 border border-gray-100 rounded-lg p-4 flex-wrap"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${className}`}
                    >
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                      <p className="text-sm text-gray-400 mt-0.5">{n.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    {n.date} • {n.time}
                  </span>
                </div>
              );
            })}
          </AsyncState>
        </div>
      </div>
    </StudentLayout>
  );
}