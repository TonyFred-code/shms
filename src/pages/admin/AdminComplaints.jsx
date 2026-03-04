import { useState } from "react";
import {
  Wrench,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useData } from "../../hooks/useData.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Alert from "../../components/ui/Alert.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import { PriorityBadge, StatusBadge } from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";
import Button from "../../components/ui/Button.jsx";

export default function AdminComplaints() {
  const { users, hostels, rooms, complaints, updateComplaint } = useData();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterHostel, setFilterHostel] = useState("all");
  const [selected, setSelected] = useState(null);
  const [resolution, setResolution] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const getName = (id) => users.find((u) => u.id === id)?.name || "Unknown";
  const getRoom = (id) => rooms.find((r) => r.id === id);
  const getHostelName = (id) => hostels.find((h) => h.id === id)?.name || "—";

  const pending = complaints.filter((c) => c.status === "pending");
  const inProgress = complaints.filter((c) => c.status === "in-progress");
  const resolved = complaints.filter((c) => c.status === "resolved");
  const highPriority = complaints.filter(
    (c) => c.priority === "high" && c.status !== "resolved"
  );

  const filtered = complaints
    .filter((c) => {
      const matchSearch =
        getName(c.studentId).toLowerCase().includes(search.toLowerCase()) ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || c.status === filterStatus;
      const matchPriority =
        filterPriority === "all" || c.priority === filterPriority;
      const matchHostel = filterHostel === "all" || c.hostelId === filterHostel;
      return matchSearch && matchStatus && matchPriority && matchHostel;
    })
    .sort((a, b) => {
      // Unresolved first, then by priority
      if (a.status === "resolved" && b.status !== "resolved") return 1;
      if (a.status !== "resolved" && b.status === "resolved") return -1;
      const pOrder = { high: 0, medium: 1, low: 2 };
      return (pOrder[a.priority] ?? 3) - (pOrder[b.priority] ?? 3);
    });

  const openSelected = (c) => {
    setSelected(c);
    setResolution(c.resolution || "");
  };

  const handleSetInProgress = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    updateComplaint(selected.id, { status: "in-progress" });
    setLoading(false);
    setSelected(null);
    setAlert({ type: "success", msg: "Complaint marked as in progress." });
  };

  const handleResolve = async () => {
    if (!resolution.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    updateComplaint(selected.id, { status: "resolved", resolution });
    setLoading(false);
    setSelected(null);
    setAlert({ type: "success", msg: "Complaint marked as resolved." });
  };

  const handleReopenToInProgress = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    updateComplaint(selected.id, { status: "in-progress", resolution: null });
    setLoading(false);
    setSelected(null);
    setAlert({
      type: "info",
      msg: "Complaint re-opened and set to in progress.",
    });
  };

  return (
    <div>
      <PageHeader
        title="Complaints"
        subtitle="Review and manage all maintenance requests"
      />

      {alert && (
        <div className="mb-4">
          <Alert
            type={alert.type}
            message={alert.msg}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Pending"
          value={pending.length}
          icon={Clock}
          color="amber"
          sub="Awaiting action"
        />
        <StatCard
          label="In Progress"
          value={inProgress.length}
          icon={Wrench}
          color="navy"
          sub="Being handled"
        />
        <StatCard
          label="Resolved"
          value={resolved.length}
          icon={CheckCircle}
          color="emerald"
          sub="Closed"
        />
        <StatCard
          label="High Priority"
          value={highPriority.length}
          icon={AlertTriangle}
          color={highPriority.length > 0 ? "red" : "emerald"}
          sub="Unresolved urgent"
        />
      </div>

      {/* Per-hostel breakdown */}
      {hostels.length > 0 && (
        <div className="grid md:grid-cols-3 gap-3 mb-5">
          {hostels.map((h) => {
            const hc = complaints.filter((c) => c.hostelId === h.id);
            const hOpen = hc.filter((c) => c.status !== "resolved").length;
            return (
              <div key={h.id} className="card py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-navy-100 text-navy-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {h.code}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {h.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {hc.length} total ·{" "}
                    <span
                      className={
                        hOpen > 0
                          ? "text-amber-600 font-medium"
                          : "text-emerald-600"
                      }
                    >
                      {hOpen} open
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
            placeholder="Search by student, title, category..."
          />
        </div>
        <select
          value={filterHostel}
          onChange={(e) => setFilterHostel(e.target.value)}
          className="input sm:w-44"
        >
          <option value="all">All Hostels</option>
          {hostels.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input sm:w-36"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="input sm:w-36"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Issue
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Student
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Location
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Category
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Priority
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Status
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Date
              </th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const room = getRoom(c.roomId);
              return (
                <tr key={c.id} className="table-row">
                  <td className="py-3.5 pr-4 max-w-50">
                    <p className="font-medium text-gray-800 truncate">
                      {c.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {c.description.slice(0, 55)}…
                    </p>
                  </td>
                  <td className="py-3.5 pr-4 text-gray-700">
                    {getName(c.studentId)}
                  </td>
                  <td className="py-3.5 pr-4">
                    {room ? (
                      <div>
                        <p className="font-mono text-xs text-navy-700">
                          Block {room.block} · {room.number}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {getHostelName(c.hostelId)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3.5 pr-4 text-gray-600 text-xs">
                    {c.category}
                  </td>
                  <td className="py-3.5 pr-4">
                    <PriorityBadge priority={c.priority} />
                  </td>
                  <td className="py-3.5 pr-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="py-3.5 pr-4 text-gray-500 text-xs">
                    {c.createdAt}
                  </td>
                  <td className="py-3.5">
                    <button
                      onClick={() => openSelected(c)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors font-medium"
                    >
                      {c.status !== "resolved" ? "Manage" : "View"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-gray-400 text-sm"
                >
                  No complaints found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail / Manage Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Complaint Details"
        width="max-w-xl"
      >
        {selected &&
          (() => {
            const room = getRoom(selected.roomId);
            return (
              <div className="space-y-4">
                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                      Student
                    </p>
                    <p className="font-medium text-gray-800">
                      {getName(selected.studentId)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                      Location
                    </p>
                    {room ? (
                      <p className="text-gray-800">
                        <span className="font-mono">
                          {room.block}
                          {room.number}
                        </span>
                        <span className="text-gray-400 text-xs ml-1">
                          · {getHostelName(selected.hostelId)}
                        </span>
                      </p>
                    ) : (
                      <p className="text-gray-400">—</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                      Category
                    </p>
                    <p className="text-gray-800">{selected.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                      Submitted
                    </p>
                    <p className="text-gray-800">{selected.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                      Priority
                    </p>
                    <PriorityBadge priority={selected.priority} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                      Status
                    </p>
                    <StatusBadge status={selected.status} />
                  </div>
                  {selected.updatedAt !== selected.createdAt && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                        Last Updated
                      </p>
                      <p className="text-gray-800">{selected.updatedAt}</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
                    Description
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3">
                    {selected.description}
                  </p>
                </div>

                {/* Resolution input — show for non-resolved */}
                {selected.status !== "resolved" && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
                      Resolution Notes
                    </p>
                    <textarea
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="input min-h-20 resize-y"
                      placeholder="Describe steps taken or solution applied..."
                    />
                  </div>
                )}

                {/* Existing resolution — show for resolved */}
                {selected.status === "resolved" && selected.resolution && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <p className="text-xs text-emerald-600 mb-1 uppercase tracking-wide font-medium">
                      Resolution
                    </p>
                    <p className="text-sm text-emerald-800 leading-relaxed">
                      {selected.resolution}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 justify-end border-t pt-4 flex-wrap">
                  <Button variant="secondary" onClick={() => setSelected(null)}>
                    Close
                  </Button>

                  {selected.status === "pending" && (
                    <Button
                      variant="secondary"
                      onClick={handleSetInProgress}
                      loading={loading}
                    >
                      Mark In Progress
                    </Button>
                  )}

                  {selected.status !== "resolved" && (
                    <Button
                      onClick={handleResolve}
                      loading={loading}
                      disabled={!resolution.trim()}
                    >
                      <CheckCircle size={14} /> Mark Resolved
                    </Button>
                  )}

                  {selected.status === "resolved" && (
                    <Button
                      variant="secondary"
                      onClick={handleReopenToInProgress}
                      loading={loading}
                    >
                      Re-open Complaint
                    </Button>
                  )}
                </div>
              </div>
            );
          })()}
      </Modal>
    </div>
  );
}
