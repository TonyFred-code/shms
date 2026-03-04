import {
  BedDouble,
  CreditCard,
  ClipboardList,
  Megaphone,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useData } from "../../hooks/useData.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Badge, {
  PriorityBadge,
  StatusBadge,
} from "../../components/ui/Badge.jsx";

export default function StudentDashboard() {
  const { user } = useAuth();
  const {
    allocations,
    rooms,
    hostels,
    payments,
    complaints,
    announcements,
    applications,
    // feeConfigs,
  } = useData();

  const myAllocation = allocations.find(
    (a) => a.studentId === user.id && a.status === "active"
  );
  const myRoom = myAllocation
    ? rooms.find((r) => r.id === myAllocation.roomId)
    : null;
  const myHostel = myAllocation
    ? hostels.find((h) => h.id === myAllocation.hostelId)
    : null;
  const myPayments = payments.filter((p) => p.studentId === user.id);
  const myComplaints = complaints.filter((c) => c.studentId === user.id);
  const myApplication = applications.find(
    (a) => a.studentId === user.id && ["pending", "approved"].includes(a.status)
  );

  const pendingPayments = myPayments.filter((p) => p.status !== "paid");
  const overduePayments = myPayments.filter((p) => p.status === "overdue");
  const openComplaints = myComplaints.filter((c) => c.status !== "resolved");
  const totalOwed = pendingPayments.reduce((s, p) => s + p.amount, 0);

  const fmt = (n) => `₦${n.toLocaleString()}`;

  return (
    <div>
      <PageHeader
        title={`Good day, ${user.name.split(" ")[0]}`}
        subtitle={`${user.studentId || ""} · ${user.course || "Student"} · Year ${user.year || 1}`}
      />

      {/* Alerts */}
      {overduePayments.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-4 text-red-800 text-sm">
          <AlertTriangle size={15} className="shrink-0 text-red-500" />
          <span>
            You have{" "}
            <strong>{overduePayments.length} overdue payment(s)</strong>{" "}
            totalling {fmt(overduePayments.reduce((s, p) => s + p.amount, 0))}.
            Please clear immediately.
          </span>
        </div>
      )}

      {!myAllocation && !myApplication && (
        <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4 text-amber-800 text-sm">
          <div className="flex items-center gap-3">
            <BedDouble size={15} className="shrink-0 text-amber-500" />
            <span>
              You don&apos;t have a room yet. Apply for accommodation to get
              started.
            </span>
          </div>
          <Link to="/student/apply" className="btn-primary text-xs px-3 py-1.5">
            Apply Now
          </Link>
        </div>
      )}

      {myApplication?.status === "pending" && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-4 text-blue-800 text-sm">
          <Clock size={15} className="shrink-0 text-blue-500" />
          <span>
            Your accommodation application is <strong>pending review</strong>.
            We&apos;ll notify you once it&apos;s processed.
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Room"
          value={myRoom ? `${myRoom.block}${myRoom.number}` : "Not Assigned"}
          icon={BedDouble}
          color={myRoom ? "navy" : "amber"}
          sub={myHostel ? myHostel.name : "Apply for accommodation"}
        />
        <StatCard
          label="Outstanding Fees"
          value={pendingPayments.length === 0 ? "Cleared" : fmt(totalOwed)}
          icon={CreditCard}
          color={
            pendingPayments.length === 0
              ? "emerald"
              : overduePayments.length > 0
                ? "red"
                : "amber"
          }
          sub={`${myPayments.filter((p) => p.status === "paid").length} instalment(s) paid`}
        />
        <StatCard
          label="Open Complaints"
          value={openComplaints.length}
          icon={ClipboardList}
          color={openComplaints.length > 0 ? "purple" : "emerald"}
          sub={`${myComplaints.length} total submitted`}
        />
        <StatCard
          label="Notices"
          value={announcements.length}
          icon={Megaphone}
          color="navy"
          sub="Active announcements"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Room Card */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BedDouble size={15} className="text-navy-600" />
            <h2 className="font-display text-navy-950">My Room</h2>
          </div>
          {myRoom && myHostel ? (
            <div className="space-y-3">
              <div className="bg-navy-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-display text-navy-800">
                  {myRoom.block}
                  {myRoom.number}
                </p>
                <p className="text-sm text-navy-500 mt-1">{myHostel.name}</p>
                <p className="text-xs text-navy-400">
                  Block {myRoom.block} · Floor {myRoom.floor}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <StatusBadge status={myRoom.status} />
                <Badge variant="navy">{myRoom.type}</Badge>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {myRoom.amenities.map((a) => (
                  <Badge key={a} variant="default">
                    {a}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-gray-500 pt-2 border-t">
                <p>
                  Since: {myAllocation.startDate} · Until:{" "}
                  {myAllocation.endDate}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <BedDouble size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No room allocated</p>
              {myApplication?.status === "pending" ? (
                <p className="text-xs mt-1 text-blue-500">
                  Application pending...
                </p>
              ) : (
                <Link
                  to="/student/apply"
                  className="text-xs text-navy-600 hover:underline mt-1 block"
                >
                  Apply for accommodation →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Payments */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard size={15} className="text-navy-600" />
              <h2 className="font-display text-navy-950">Fee Payments</h2>
            </div>
            <Link
              to="/student/payments"
              className="text-xs text-navy-600 hover:underline"
            >
              View all →
            </Link>
          </div>
          {myPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CreditCard size={24} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No payment records yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {myPayments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      p.status === "paid"
                        ? "bg-emerald-400"
                        : p.status === "overdue"
                          ? "bg-red-400"
                          : "bg-amber-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      {p.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.academicYear} · Due: {p.dueDate}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-mono font-medium text-gray-800">
                      {fmt(p.amount)}
                    </p>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              ))}
              {myPayments.length > 0 && (
                <div className="pt-2 border-t flex justify-between text-xs text-gray-500">
                  <span>
                    Total paid:{" "}
                    {fmt(
                      myPayments
                        .filter((p) => p.status === "paid")
                        .reduce((s, p) => s + p.amount, 0)
                    )}
                  </span>
                  <span>
                    Outstanding:{" "}
                    {fmt(pendingPayments.reduce((s, p) => s + p.amount, 0))}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Announcements + Recent Complaints */}
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone size={15} className="text-navy-600" />
            <h2 className="font-display text-navy-950">Announcements</h2>
          </div>
          {announcements.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              No announcements.
            </p>
          ) : (
            <ul className="space-y-3">
              {announcements.slice(0, 3).map((a) => (
                <li
                  key={a.id}
                  className="border border-gray-100 rounded-xl p-3.5"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-800">
                      {a.title}
                    </p>
                    <Badge
                      variant={
                        a.priority === "high"
                          ? "danger"
                          : a.priority === "medium"
                            ? "warning"
                            : "default"
                      }
                    >
                      {a.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {a.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">{a.date}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClipboardList size={15} className="text-navy-600" />
              <h2 className="font-display text-navy-950">Recent Complaints</h2>
            </div>
            <Link
              to="/student/complaints"
              className="text-xs text-navy-600 hover:underline"
            >
              View all →
            </Link>
          </div>
          {myComplaints.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CheckCircle size={24} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No complaints submitted</p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {myComplaints.slice(0, 4).map((c) => (
                <li
                  key={c.id}
                  className="flex items-start gap-3 border border-gray-100 rounded-xl p-3"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      c.status === "resolved"
                        ? "bg-emerald-400"
                        : c.status === "in-progress"
                          ? "bg-blue-400"
                          : "bg-amber-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {c.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {c.category} · {c.createdAt}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
