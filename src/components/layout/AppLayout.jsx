import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BedDouble,
  Users,
  CreditCard,
  Wrench,
  LogOut,
  Menu,
  Bell,
  Building2,
  ClipboardList,
  Home,
  FileText,
  Megaphone,
  CheckCheck,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useData } from "../../hooks/useData.jsx";
import Avatar from "../ui/Avatar.jsx";

const adminLinks = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/hostels", icon: Building2, label: "Hostels" },
  { to: "/admin/rooms", icon: BedDouble, label: "Rooms" },
  { to: "/admin/students", icon: Users, label: "Students" },
  { to: "/admin/applications", icon: FileText, label: "Applications" },
  { to: "/admin/payments", icon: CreditCard, label: "Payments" },
  { to: "/admin/fees", icon: CreditCard, label: "Fee Config" },
  { to: "/admin/complaints", icon: Wrench, label: "Complaints" },
  { to: "/admin/announcements", icon: Megaphone, label: "Announcements" },
];

const studentLinks = [
  { to: "/student/dashboard", icon: Home, label: "My Dashboard" },
  { to: "/student/apply", icon: FileText, label: "Apply / My Application" },
  { to: "/student/room", icon: BedDouble, label: "My Room" },
  { to: "/student/payments", icon: CreditCard, label: "Payments" },
  { to: "/student/complaints", icon: ClipboardList, label: "Complaints" },
];

const notifIconMap = {
  application_submitted: FileText,
  application_approved: FileText,
  application_rejected: FileText,
  complaint_new: Wrench,
  complaint_resolved: Wrench,
  payment_overdue: CreditCard,
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { notifications, markNotificationRead, markAllRead } = useData();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const links = user?.role === "admin" ? adminLinks : studentLinks;

  const myNotifs = notifications.filter(
    (n) => n.role === user?.role || n.targetUserId === user?.id
  );
  const unreadCount = myNotifs.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNotifClick = (notif) => {
    markNotificationRead(notif.id);
    setNotifOpen(false);
    if (notif.linkTo) navigate(notif.linkTo);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-navy-950 flex flex-col transition-transform duration-300
        lg:translate-x-0 lg:relative lg:flex
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-navy-600 flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-display text-base leading-tight">
                SHMS
              </p>
              <p className="text-navy-300 text-xs">Hostel Management</p>
            </div>
          </div>
        </div>

        <div className="px-5 pt-4 pb-2">
          <span className="text-xs font-medium text-navy-400 uppercase tracking-widest">
            {user?.role === "admin" ? "Administration" : "Student Portal"}
          </span>
        </div>

        <nav className="flex-1 px-3 pb-4 overflow-y-auto">
          <ul className="flex flex-col gap-0.5">
            {links.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <Avatar initials={user?.avatar} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.name}
              </p>
              <p className="text-navy-400 text-xs truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-navy-400 hover:text-red-400 hover:bg-white/10 transition-colors"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3.5 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} className="text-gray-600" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="p-2 rounded-lg hover:bg-gray-100 relative text-gray-600 transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-slide-up">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <p className="font-display text-navy-950 text-sm">
                      Notifications
                    </p>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-navy-600 hover:text-navy-800 flex items-center gap-1"
                      >
                        <CheckCheck size={12} /> Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {myNotifs.length === 0 ? (
                      <div className="py-8 text-center text-gray-400 text-sm">
                        <Bell size={20} className="mx-auto mb-2 opacity-40" />
                        No notifications yet
                      </div>
                    ) : (
                      myNotifs.map((n) => {
                        const Icon = notifIconMap[n.type] || Bell;
                        return (
                          <button
                            key={n.id}
                            onClick={() => handleNotifClick(n)}
                            className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${!n.read ? "bg-blue-50/50" : ""}`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${!n.read ? "bg-navy-100 text-navy-700" : "bg-gray-100 text-gray-500"}`}
                            >
                              <Icon size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm leading-snug ${!n.read ? "text-gray-800 font-medium" : "text-gray-600"}`}
                              >
                                {n.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {new Date(n.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                            {!n.read && (
                              <div className="w-2 h-2 bg-navy-600 rounded-full mt-1.5 shrink-0" />
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <Avatar initials={user?.avatar} size="sm" />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-800 leading-none">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
