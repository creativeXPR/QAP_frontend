import { useState } from "react";
import StudentLayout from "../../components/student/StudentLayout";
import { RefreshCcw, CheckCircle2 } from "../../lib/icons";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "review",
    title: "Your Submission is now in review",
    description: "The Physics Department has been contacted regarding your PHY101",
    date: "2026-07-02",
    time: "08:55",
    read: false,
  },
  {
    id: 2,
    type: "review",
    title: "Your Submission is now in review",
    description: "The Physics Department has been contacted regarding your PHY101",
    date: "2026-07-02",
    time: "08:55",
    read: false,
  },
  {
    id: 3,
    type: "resolved",
    title: "Submission resolved & Closed",
    description:
      "The Physics Department has been contacted Your missing result concern has been resolved. Please confirm on the portal.regarding your PHY101",
    date: "2026-07-02",
    time: "08:55",
    read: true,
  },
  {
    id: 4,
    type: "review",
    title: "Your Submission is now in review",
    description: "The Physics Department has been contacted regarding your PHY101",
    date: "2026-07-02",
    time: "08:55",
    read: true,
  },
  {
    id: 5,
    type: "review",
    title: "Your Submission is now in review",
    description: "The Physics Department has been contacted regarding your PHY101",
    date: "2026-07-02",
    time: "08:55",
    read: true,
  },
  {
    id: 6,
    type: "review",
    title: "Your Submission is now in review",
    description: "The Physics Department has been contacted regarding your PHY101",
    date: "2026-07-02",
    time: "08:55",
    read: true,
  },
];

const TYPE_STYLES = {
  review: { icon: RefreshCcw, className: "bg-blue-50 text-blue-500" },
  resolved: { icon: CheckCircle2, className: "bg-emerald-50 text-emerald-600" },
};

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
        </div>
      </div>
    </StudentLayout>
  );
}