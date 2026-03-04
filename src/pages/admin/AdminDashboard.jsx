import {
  Users,
  CreditCard,
  Wrench,
  TrendingUp,
  AlertTriangle,
  FileText,
  Building2,
} from "lucide-react";
import { useData } from "../../hooks/useData.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import { StatusBadge } from "../../components/ui/Badge.jsx";

export default function AdminDashboard() {
  const {
    users,
    hostels,
    rooms,
    allocations,
    payments,
    complaints,
    applications,
  } = useData();

  const students = users.filter((u) => u.role === "student");
  // const availableRooms = rooms.filter((r) => r.status === "available").length;
  const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
  // const maintenanceRooms = rooms.filter(
  //   (r) => r.status === "maintenance"
  // ).length;
  const occupancyRate =
    rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0;

  const paidPayments = payments.filter((p) => p.status === "paid");
  const unpaidPayments = payments.filter((p) => p.status !== "paid");
  const totalRevenue = paidPayments.reduce((s, p) => s + p.amount, 0);

  const openComplaints = complaints.filter((c) => c.status !== "resolved");
  const highPriorityComplaints = complaints.filter(
    (c) => c.priority === "high" && c.status !== "resolved"
  );
  const pendingApplications = applications.filter(
    (a) => a.status === "pending"
  );

  const recentComplaints = [...complaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5);

  const getUserName = (id) => users.find((u) => u.id === id)?.name || "Unknown";
  const getHostelName = (id) =>
    hostels.find((h) => h.id === id)?.name || "Unknown";
  const fmt = (n) => `₦${n.toLocaleString()}`;

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle="Smart Hostel Management System — Admin Dashboard"
      />

      {(highPriorityComplaints.length > 0 ||
        pendingApplications.length > 0) && (
        <div className="space-y-2 mb-5">
          {highPriorityComplaints.length > 0 && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm animate-fade-in">
              <AlertTriangle size={16} className="shrink-0 text-red-500" />
              <span>
                <strong>
                  {highPriorityComplaints.length} high-priority complaint(s)
                </strong>{" "}
                require immediate attention.
              </span>
            </div>
          )}
          {pendingApplications.length > 0 && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm animate-fade-in">
              <FileText size={16} className="shrink-0 text-amber-500" />
              <span>
                <strong>
                  {pendingApplications.length} accommodation application(s)
                </strong>{" "}
                awaiting review.
              </span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Hostels"
          value={hostels.length}
          icon={Building2}
          color="navy"
          sub={`${rooms.length} total rooms`}
        />
        <StatCard
          label="Students"
          value={students.length}
          icon={Users}
          color="purple"
          sub={`${allocations.filter((a) => a.status === "active").length} allocated`}
        />
        <StatCard
          label="Revenue Collected"
          value={fmt(totalRevenue)}
          icon={CreditCard}
          color="emerald"
          sub={`${unpaidPayments.length} unpaid instalments`}
        />
        <StatCard
          label="Open Complaints"
          value={openComplaints.length}
          icon={Wrench}
          color={openComplaints.length > 2 ? "red" : "amber"}
          sub={`${highPriorityComplaints.length} high priority`}
        />
      </div>

      {/* Occupancy per hostel */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={15} className="text-navy-600" />
          <h2 className="font-display text-navy-950">Occupancy by Hostel</h2>
          <span className="ml-auto text-sm font-medium text-navy-700">
            {occupancyRate}% overall
          </span>
        </div>
        <div className="space-y-4">
          {hostels.map((h) => {
            const hostelRooms = rooms.filter((r) => r.hostelId === h.id);
            const hostelOccupied = hostelRooms.filter(
              (r) => r.status === "occupied"
            ).length;
            // const hostelAvailable = hostelRooms.filter(
            //   (r) => r.status === "available"
            // ).length;
            const rate =
              hostelRooms.length > 0
                ? Math.round((hostelOccupied / hostelRooms.length) * 100)
                : 0;
            return (
              <div key={h.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">
                      {h.name}
                    </span>
                    <span className="text-xs text-gray-400">{h.gender}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {hostelOccupied}/{hostelRooms.length} rooms · {rate}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-navy-600 rounded-full transition-all"
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-display text-navy-950 mb-4">
            Recent Applications
          </h2>
          <ul className="space-y-2.5">
            {recentApplications.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">
                No applications yet.
              </p>
            )}
            {recentApplications.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {getUserName(a.studentId)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getHostelName(a.hostelId)} · {a.preferredRoomType} ·{" "}
                    {a.academicYear}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2 className="font-display text-navy-950 mb-4">Recent Complaints</h2>
          <ul className="space-y-2.5">
            {recentComplaints.map((c) => (
              <li
                key={c.id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${c.priority === "high" ? "bg-red-400" : c.priority === "medium" ? "bg-amber-400" : "bg-gray-300"}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {c.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getUserName(c.studentId)} · {c.category} · {c.createdAt}
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
