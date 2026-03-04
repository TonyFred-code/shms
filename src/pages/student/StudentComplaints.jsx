import { useState } from "react";
import { Plus, ClipboardList } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useData } from "../../hooks/useData.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Alert from "../../components/ui/Alert.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { PriorityBadge, StatusBadge } from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";

const CATEGORIES = [
  "Electrical",
  "Plumbing",
  "Structural",
  "Network",
  "Furniture",
  "Cleaning",
  "Other",
];
const PRIORITIES = ["low", "medium", "high"];

export default function StudentComplaints() {
  const { user } = useAuth();
  const { complaints, allocations, rooms, hostels, addComplaint } = useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "",
    priority: "medium",
    description: "",
  });
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const myAllocation = allocations.find(
    (a) => a.studentId === user.id && a.status === "active"
  );
  const myRoom = myAllocation
    ? rooms.find((r) => r.id === myAllocation.roomId)
    : null;
  const myHostel = myAllocation
    ? hostels.find((h) => h.id === myAllocation.hostelId)
    : null;

  const myComplaints = complaints
    .filter((c) => c.studentId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!myAllocation) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    addComplaint({
      ...form,
      studentId: user.id,
      roomId: myAllocation.roomId,
      hostelId: myAllocation.hostelId,
    });
    setLoading(false);
    setModalOpen(false);
    setForm({ title: "", category: "", priority: "medium", description: "" });
    setSuccess(
      "Complaint submitted successfully. Admin will review it shortly."
    );
    setTimeout(() => setSuccess(""), 4000);
  };

  return (
    <div>
      <PageHeader
        title="Complaints"
        subtitle={
          myHostel
            ? `${myHostel.name} · Block ${myRoom?.block}, Room ${myRoom?.number}`
            : "Maintenance requests"
        }
        actions={
          myAllocation && (
            <Button onClick={() => setModalOpen(true)}>
              <Plus size={14} /> New Complaint
            </Button>
          )
        }
      />

      {success && (
        <div className="mb-4">
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess("")}
          />
        </div>
      )}

      {!myAllocation && (
        <div className="mb-4">
          <Alert
            type="warning"
            message="You need an active room allocation to submit complaints."
          />
        </div>
      )}

      {myComplaints.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={ClipboardList}
            title="No complaints yet"
            description="Submit a maintenance request if you notice any issues in your room."
            action={
              myAllocation && (
                <Button onClick={() => setModalOpen(true)}>
                  <Plus size={14} /> Submit Complaint
                </Button>
              )
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {myComplaints.map((c) => (
            <div
              key={c.id}
              className="card cursor-pointer hover:shadow-card-hover transition-shadow"
              onClick={() => setSelected(c)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 mb-1">{c.title}</p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {c.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} />
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                      {c.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      Submitted: {c.createdAt}
                    </span>
                    {c.updatedAt !== c.createdAt && (
                      <span className="text-xs text-gray-400">
                        Updated: {c.updatedAt}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {c.resolution && (
                <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-emerald-700 bg-emerald-50 rounded-lg p-3">
                  <strong>Resolution:</strong> {c.resolution}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New Complaint Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Submit Maintenance Complaint"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {myRoom && myHostel && (
            <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
              Filing for: <strong>{myHostel.name}</strong> · Block{" "}
              {myRoom.block} · Room {myRoom.number}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Issue Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="input"
              placeholder="e.g. Broken window latch"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="input"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input min-h-25 resize-y"
              placeholder="Describe the issue in detail..."
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Submit Complaint
            </Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Complaint Details"
      >
        {selected && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                Title
              </p>
              <p className="font-medium text-gray-800">{selected.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                  Status
                </p>
                <StatusBadge status={selected.status} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                  Priority
                </p>
                <PriorityBadge priority={selected.priority} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                  Category
                </p>
                <p className="text-sm text-gray-700">{selected.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                  Submitted
                </p>
                <p className="text-sm text-gray-700">{selected.createdAt}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                Description
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {selected.description}
              </p>
            </div>
            {selected.resolution && (
              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-xs text-emerald-600 mb-1 uppercase tracking-wide font-medium">
                  Resolution
                </p>
                <p className="text-sm text-emerald-800">
                  {selected.resolution}
                </p>
              </div>
            )}
            <div className="flex justify-end border-t pt-4">
              <Button variant="secondary" onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
