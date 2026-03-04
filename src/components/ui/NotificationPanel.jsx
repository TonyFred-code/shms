import {
  BedDouble,
  Bell,
  CheckCircle,
  ClipboardList,
  CreditCard,
  X,
} from "lucide-react";
import { array, func, string } from "prop-types";
import { useEffect, useRef, useState } from "react";

const notifIcons = {
  complaint_new: ClipboardList,
  complaint_resolved: CheckCircle,
  application_submitted: BedDouble,
  application_approved: CheckCircle,
  application_rejected: X,
  payment_overdue: CreditCard,
};

const notifColors = {
  complaint_new: "text-amber-600 bg-amber-50",
  complaint_resolved: "text-emerald-600 bg-emerald-50",
  application_submitted: "text-navy-600 bg-navy-50",
  application_approved: "text-emerald-600 bg-emerald-50",
  application_rejected: "text-red-600 bg-red-50",
  payment_overdue: "text-red-600 bg-red-50",
};

export function NotificationPanel({
  notifications,
  onMarkRead,
  onMarkAllRead,
  userRole,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const relevant = notifications.filter(
    (n) => !n.role || n.role === userRole || n.role === "both"
  );
  const unread = relevant.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-lg hover:bg-gray-100 relative text-gray-600 transition-colors"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-slide-up overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-800">
                Notifications
              </h3>
              {unread > 0 && (
                <span className="text-xs bg-navy-100 text-navy-700 px-1.5 py-0.5 rounded-full font-medium">
                  {unread} new
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={onMarkAllRead}
                className="text-xs text-navy-600 hover:text-navy-800 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {relevant.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">
                <Bell size={20} className="mx-auto mb-2 opacity-40" />
                No notifications yet
              </div>
            ) : (
              relevant.slice(0, 20).map((n) => {
                const Icon = notifIcons[n.type] || Bell;
                const colorClass =
                  notifColors[n.type] || "text-gray-600 bg-gray-100";
                return (
                  <div
                    key={n.id}
                    onClick={() => onMarkRead(n.id)}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${!n.read ? "bg-blue-50/40" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}
                    >
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 leading-snug">
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 bg-navy-500 rounded-full shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

NotificationPanel.propTypes = {
  notifications: array.isRequired,
  onMarkRead: func.isRequired,
  onMarkAllRead: func.isRequired,
  userRole: string,
};
