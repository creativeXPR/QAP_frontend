import { useEffect, useState } from "react";
import StudentLayout from "../../components/student/StudentLayout";
import { RefreshCcw, CheckCircle2 } from "../../lib/icons";
import { getListItems } from "../../api/client";
import { students } from "../../api/services";

const TYPE_STYLES = {
  review: { icon: RefreshCcw, className: "bg-blue-50 text-blue-500" },
  resolved: { icon: CheckCircle2, className: "bg-emerald-50 text-emerald-600" },
};

function mapNotification(item) {
  const createdAt = item?.created_at ? new Date(item.created_at) : null;

  return {
    id: item.id,
    type: item.notification_type === "complaint_update" ? "review" : "review",
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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    async function loadNotifications() {
      try {
        const data = await students.notifications.list();
        setNotifications(getListItems(data).map(mapNotification));
      } catch (error) {
        console.error("Failed to load notifications:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      await Promise.all(unread.map((n) => students.notifications.markRead(n.id)));
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
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
          {loading ? (
            <p className="text-sm text-gray-500">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No notifications found.</p>
          ) : notifications.map((n) => {
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
        </div>
      </div>
    </StudentLayout>
  );
}
