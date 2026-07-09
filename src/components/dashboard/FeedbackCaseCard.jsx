import { useState } from "react";
import { students } from "../../api/services";

/**
 * Collapsible card for a single student feedback/complaint record.
 * Shared between AdminPortal (reply + status + delete) and FPLanding
 * (reply + status only — deletion is admin-only).
 *
 * `item` is the shape returned by mapFeedbackForStaff (see submissionMapper.js).
 */
export default function FeedbackCaseCard({
  item,
  actions = ["reply", "status", "delete"],
  onUpdated,
  onDeleted,
}) {
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState(item.adminComment || "");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const isResolved = item.rawStatus === "resolved";

  const handleSendReply = async () => {
    setSubmitting(true);
    setActionError(null);
    try {
      const updated = await students.feedback.partialUpdate(item.id, {
        admin_comment: reply,
      });
      onUpdated?.(updated);
    } catch (error) {
      setActionError(error.message || "Failed to send reply.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    setSubmitting(true);
    setActionError(null);
    try {
      const updated = await students.feedback.partialUpdate(item.id, {
        status: isResolved ? "pending" : "resolved",
      });
      onUpdated?.(updated);
    } catch (error) {
      setActionError(error.message || "Failed to update status.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    setActionError(null);
    try {
      await students.feedback.remove(item.id);
      onDeleted?.(item.id);
    } catch (error) {
      setActionError(error.message || "Failed to delete.");
      setSubmitting(false);
    }
  };

  return (
    <div className="border border-gray-100 rounded-lg bg-white mb-3 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left"
      >
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-semibold text-gray-900">
              {item.studentName || "Anonymous"}
            </h3>
            <span className="text-[11px] font-medium text-brand bg-brand/5 px-2 py-0.5 rounded-full">
              {item.category}
            </span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                isResolved
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {isResolved ? "Resolved" : "Pending"}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {item.studentEmail} · {item.submittedAt}
          </p>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          <p className="text-xs font-semibold text-gray-500 mb-1">Message:</p>
          <p className="text-sm text-gray-700 mb-4 whitespace-pre-line">
            {item.title}
          </p>

          {actions.includes("reply") && (
            <>
              <p className="text-xs font-semibold text-gray-500 mb-1">
                Admin Reply:
              </p>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
                placeholder="Write a reply to this user..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand resize-none"
              />
            </>
          )}

          {actionError && (
            <p className="text-xs text-red-500 mb-3">{actionError}</p>
          )}

          <div className="flex gap-2 flex-wrap">
            {actions.includes("reply") && (
              <button
                onClick={handleSendReply}
                disabled={submitting}
                className="text-base font-medium bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-[10px] disabled:opacity-60"
              >
                Send Reply
              </button>
            )}
            {actions.includes("status") && (
              <button
                onClick={handleToggleStatus}
                disabled={submitting}
                className={`text-sm font-medium px-4 py-2 rounded-md text-white disabled:opacity-60 ${
                  isResolved
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                Mark as {isResolved ? "Pending" : "Resolved"}
              </button>
            )}
            {actions.includes("delete") && (
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="text-base font-medium border border-gray-200 text-gray-500 px-4 py-2 rounded-[10px] hover:bg-gray-50 disabled:opacity-60"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
