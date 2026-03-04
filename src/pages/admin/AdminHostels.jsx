import { useState } from "react";
import { Plus, Building2, Edit2, Trash2, Users, BedDouble } from "lucide-react";
import { useData } from "../../hooks/useData.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { bool, func, number, shape, string } from "prop-types";

function HostelForm({ initial = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    code: initial.code || "",
    gender: initial.gender || "Mixed",
    totalFloors: initial.totalFloors || 2,
    blocks: initial.blocks ? initial.blocks.join(",") : "A,B",
    description: initial.description || "",
  });
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      totalFloors: parseInt(form.totalFloors) || 1,
      blocks: form.blocks
        .split(",")
        .map((b) => b.trim().toUpperCase())
        .filter(Boolean),
    });
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Hostel Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input"
            placeholder="e.g. Nnamdi Azikiwe Hall"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Code</label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            className="input"
            placeholder="e.g. NAH"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="input"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Total Floors
          </label>
          <input
            type="number"
            name="totalFloors"
            value={form.totalFloors}
            onChange={handleChange}
            className="input"
            min={1}
            max={20}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Blocks (comma-separated)
          </label>
          <input
            name="blocks"
            value={form.blocks}
            onChange={handleChange}
            className="input"
            placeholder="A,B,C"
          />
        </div>
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="input min-h-[80px]"
            placeholder="Brief description..."
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initial.id ? "Save Changes" : "Add Hostel"}
        </Button>
      </div>
    </form>
  );
}

HostelForm.propTypes = {
  initial: shape({
    name: string,
    code: string,
    gender: string,
    totalFloors: number,
    blocks: string,
    description: string,
  }),
  onSubmit: func,
  onCancel: func,
  loading: bool,
};

export default function AdminHostels() {
  const { hostels, rooms, allocations, addHostel, updateHostel, deleteHostel } =
    useData();
  const [addModal, setAddModal] = useState(false);
  const [editHostel, setEditHostel] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleAdd = async (data) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    addHostel(data);
    setLoading(false);
    setAddModal(false);
    setAlert({ type: "success", msg: "Hostel added successfully." });
  };

  const handleEdit = async (data) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    updateHostel(editHostel.id, data);
    setLoading(false);
    setEditHostel(null);
    setAlert({ type: "success", msg: "Hostel updated." });
  };

  const handleDelete = () => {
    deleteHostel(deleteId);
    setDeleteId(null);
    setAlert({ type: "success", msg: "Hostel deleted." });
  };

  return (
    <div>
      <PageHeader
        title="Hostels"
        subtitle={`${hostels.length} hostels registered`}
        actions={
          <Button onClick={() => setAddModal(true)}>
            <Plus size={14} /> Add Hostel
          </Button>
        }
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

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {hostels.map((h) => {
          const hostelRooms = rooms.filter((r) => r.hostelId === h.id);
          const available = hostelRooms.filter(
            (r) => r.status === "available"
          ).length;
          const occupied = hostelRooms.filter(
            (r) => r.status === "occupied"
          ).length;
          const maintenance = hostelRooms.filter(
            (r) => r.status === "maintenance"
          ).length;
          const activeAllocs = allocations.filter(
            (a) => a.hostelId === h.id && a.status === "active"
          ).length;
          const rate =
            hostelRooms.length > 0
              ? Math.round((occupied / hostelRooms.length) * 100)
              : 0;

          return (
            <div key={h.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-100 text-navy-700 flex items-center justify-center font-mono font-bold text-sm">
                    {h.code}
                  </div>
                  <div>
                    <p className="font-display text-navy-950">{h.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge
                        variant={
                          h.gender === "Male"
                            ? "info"
                            : h.gender === "Female"
                              ? "purple"
                              : "default"
                        }
                      >
                        {h.gender}
                      </Badge>
                      <Badge variant="default">
                        {h.totalFloors} floor{h.totalFloors > 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditHostel(h)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(h.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {h.description && (
                <p className="text-xs text-gray-500 mb-3">{h.description}</p>
              )}

              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Occupancy</span>
                  <span>{rate}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-navy-600 rounded-full"
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                <div className="bg-emerald-50 rounded-lg py-2">
                  <p className="font-semibold text-emerald-700">{available}</p>
                  <p className="text-emerald-600">Available</p>
                </div>
                <div className="bg-blue-50 rounded-lg py-2">
                  <p className="font-semibold text-blue-700">{occupied}</p>
                  <p className="text-blue-600">Occupied</p>
                </div>
                <div className="bg-red-50 rounded-lg py-2">
                  <p className="font-semibold text-red-600">{maintenance}</p>
                  <p className="text-red-500">Maint.</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <BedDouble size={12} /> {hostelRooms.length} rooms
                </span>
                <span className="flex items-center gap-1">
                  <Users size={12} /> {activeAllocs} students
                </span>
                <div className="flex gap-1">
                  {h.blocks.map((b) => (
                    <span
                      key={b}
                      className="bg-gray-100 text-gray-600 rounded px-1.5 py-0.5"
                    >
                      Block {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={addModal}
        onClose={() => setAddModal(false)}
        title="Add New Hostel"
      >
        <HostelForm
          onSubmit={handleAdd}
          onCancel={() => setAddModal(false)}
          loading={loading}
        />
      </Modal>
      <Modal
        open={!!editHostel}
        onClose={() => setEditHostel(null)}
        title="Edit Hostel"
      >
        {editHostel && (
          <HostelForm
            initial={editHostel}
            onSubmit={handleEdit}
            onCancel={() => setEditHostel(null)}
            loading={loading}
          />
        )}
      </Modal>
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Hostel"
      >
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete this hostel? All associated rooms and
          records will be affected.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Hostel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
