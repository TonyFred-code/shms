import { useState } from "react";
import { FileText, Search, CheckCircle, XCircle } from "lucide-react";
import { useData } from "../../hooks/useData.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Alert from "../../components/ui/Alert.jsx";
import { StatusBadge } from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";
import Button from "../../components/ui/Button.jsx";

export default function AdminApplications() {
  const {
    users,
    hostels,
    rooms,
    allocations,
    feeConfigs,
    applications,
    approveApplication,
    rejectApplication,
  } = useData();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [reviewNote, setReviewNote] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const getUser = (id) => users.find((u) => u.id === id);
  const getHostel = (id) => hostels.find((h) => h.id === id);

  const pending = applications.filter((a) => a.status === "pending");
  const approved = applications.filter((a) => a.status === "approved");
  const rejected = applications.filter((a) => a.status === "rejected");

  const filtered = applications
    .filter((a) => {
      const student = getUser(a.studentId);
      const hostel = getHostel(a.hostelId);
      const matchSearch =
        `${student?.name} ${student?.studentId} ${hostel?.name}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || a.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  const getAvailableRoomsForApp = (app) => {
    if (!app) return [];
    return rooms.filter((r) => {
      if (r.hostelId !== app.hostelId) return false;
      if (r.status === "maintenance") return false;
      if (r.type !== app.preferredRoomType) return false;
      const occ = allocations.filter(
        (a) => a.roomId === r.id && a.status === "active"
      ).length;
      return occ < r.capacity;
    });
  };

  const hasFeeConfig = (app) =>
    app &&
    feeConfigs.some(
      (f) => f.hostelId === app.hostelId && f.academicYear === app.academicYear
    );

  const handleApprove = async () => {
    if (!selectedRoom) return;
    setLoading(true);
    const result = await approveApplication(
      selected.id,
      selectedRoom,
      reviewNote
    );
    setLoading(false);
    if (!result.success) {
      setAlert({ type: "error", msg: result.error });
      return;
    }
    setSelected(null);
    setSelectedRoom("");
    setReviewNote("");
    setAlert({
      type: "success",
      msg: "Application approved and room allocated.",
    });
  };

  const handleReject = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    rejectApplication(selected.id, rejectNote);
    setLoading(false);
    setSelected(null);
    setRejectNote("");
    setShowReject(false);
    setAlert({ type: "success", msg: "Application rejected." });
  };

  return (
    <div>
      <PageHeader
        title="Applications"
        subtitle="Review and process accommodation applications"
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

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Pending"
          value={pending.length}
          icon={FileText}
          color="amber"
        />
        <StatCard
          label="Approved"
          value={approved.length}
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          label="Rejected"
          value={rejected.length}
          icon={XCircle}
          color="red"
        />
      </div>

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
            placeholder="Search by student name or hostel..."
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input sm:w-40"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Student
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Hostel
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Room Type
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Academic Year
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Submitted
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Status
              </th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const student = getUser(a.studentId);
              const hostel = getHostel(a.hostelId);
              return (
                <tr key={a.id} className="table-row">
                  <td className="py-3.5 pr-4">
                    <p className="font-medium text-gray-800">{student?.name}</p>
                    <p className="text-xs text-gray-500 font-mono">
                      {student?.studentId}
                    </p>
                  </td>
                  <td className="py-3.5 pr-4 text-gray-700">{hostel?.name}</td>
                  <td className="py-3.5 pr-4 text-gray-700">
                    {a.preferredRoomType}
                  </td>
                  <td className="py-3.5 pr-4 text-gray-700">
                    {a.academicYear}
                  </td>
                  <td className="py-3.5 pr-4 text-gray-500">{a.submittedAt}</td>
                  <td className="py-3.5 pr-4">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="py-3.5">
                    <button
                      onClick={() => {
                        setSelected(a);
                        setSelectedRoom("");
                        setReviewNote("");
                        setShowReject(false);
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      {a.status === "pending" ? "Review" : "View"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-gray-400 text-sm"
                >
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!selected}
        onClose={() => {
          setSelected(null);
          setShowReject(false);
        }}
        title="Application Review"
        width="max-w-xl"
      >
        {selected &&
          (() => {
            const student = getUser(selected.studentId);
            const hostel = getHostel(selected.hostelId);
            const availableRooms = getAvailableRoomsForApp(selected);
            const feeExists = hasFeeConfig(selected);

            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Student</p>
                    <p className="font-medium">{student?.name}</p>
                    <p className="text-xs text-gray-400 font-mono">
                      {student?.studentId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Course</p>
                    <p>{student?.course || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Hostel Requested
                    </p>
                    <p>{hostel?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Preferred Room Type
                    </p>
                    <p>{selected.preferredRoomType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Academic Year</p>
                    <p>{selected.academicYear}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <StatusBadge status={selected.status} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Submitted</p>
                    <p>{selected.submittedAt}</p>
                  </div>
                  {selected.reviewedAt && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Reviewed</p>
                      <p>{selected.reviewedAt}</p>
                    </div>
                  )}
                </div>

                {selected.reviewNote && (
                  <div
                    className={`p-3 rounded-xl text-sm ${selected.status === "approved" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}
                  >
                    <p className="font-medium mb-0.5">Review Note</p>
                    <p>{selected.reviewNote}</p>
                  </div>
                )}

                {selected.status === "pending" && (
                  <>
                    {!feeExists && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                        ⚠ No fee configuration exists for {hostel?.name} (
                        {selected.academicYear}). Payment records will not be
                        auto-generated on approval.
                      </div>
                    )}

                    {!showReject ? (
                      <>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-medium text-gray-700">
                            Assign Room
                          </label>
                          <select
                            value={selectedRoom}
                            onChange={(e) => setSelectedRoom(e.target.value)}
                            className="input"
                          >
                            <option value="">Select a room to assign...</option>
                            {availableRooms.map((r) => {
                              const occ =
                                allocations?.filter(
                                  (a) =>
                                    a.roomId === r.id && a.status === "active"
                                ).length || 0;
                              return (
                                <option key={r.id} value={r.id}>
                                  Block {r.block} · Room {r.number} · {r.type} (
                                  {occ}/{r.capacity} occupied)
                                </option>
                              );
                            })}
                          </select>
                          {availableRooms.length === 0 && (
                            <p className="text-xs text-red-600">
                              No {selected.preferredRoomType} rooms available in
                              this hostel.
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-medium text-gray-700">
                            Approval Note (optional)
                          </label>
                          <input
                            value={reviewNote}
                            onChange={(e) => setReviewNote(e.target.value)}
                            className="input"
                            placeholder="e.g. Approved based on academic year..."
                          />
                        </div>
                        <div className="flex gap-2 justify-end border-t pt-4">
                          <Button
                            variant="secondary"
                            onClick={() => setSelected(null)}
                          >
                            Close
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => setShowReject(true)}
                          >
                            Reject
                          </Button>
                          <Button
                            onClick={handleApprove}
                            loading={loading}
                            disabled={!selectedRoom}
                          >
                            <CheckCircle size={14} /> Approve & Allocate
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-medium text-gray-700">
                            Rejection Reason
                          </label>
                          <textarea
                            value={rejectNote}
                            onChange={(e) => setRejectNote(e.target.value)}
                            className="input min-h-20"
                            placeholder="Explain reason for rejection..."
                            required
                          />
                        </div>
                        <div className="flex gap-2 justify-end border-t pt-4">
                          <Button
                            variant="secondary"
                            onClick={() => setShowReject(false)}
                          >
                            Back
                          </Button>
                          <Button
                            variant="danger"
                            onClick={handleReject}
                            loading={loading}
                            disabled={!rejectNote.trim()}
                          >
                            Confirm Rejection
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                )}

                {selected.status !== "pending" && (
                  <div className="flex justify-end border-t pt-4">
                    <Button
                      variant="secondary"
                      onClick={() => setSelected(null)}
                    >
                      Close
                    </Button>
                  </div>
                )}
              </div>
            );
          })()}
      </Modal>
    </div>
  );
}
