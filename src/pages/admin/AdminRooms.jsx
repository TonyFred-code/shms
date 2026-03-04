import { useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { array, bool, func, number, shape, string } from "prop-types";
import { useData } from "../../hooks/useData.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Badge, { StatusBadge } from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";

const ROOM_TYPES = ["Single", "Double", "Triple"];
const AMENITIES_OPTIONS = [
  "WiFi",
  "AC",
  "Fan",
  "Wardrobe",
  "Balcony",
  "En-suite",
];

function RoomForm({ initial = {}, hostels, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    hostelId: initial.hostelId || "",
    number: initial.number || "",
    block: initial.block || "A",
    type: initial.type || "Single",
    capacity: initial.capacity || 1,
    floor: initial.floor || 1,
    amenities: initial.amenities || [],
  });

  const selectedHostel = hostels.find((h) => h.id === form.hostelId);
  const availableBlocks = selectedHostel?.blocks || ["A", "B", "C"];

  const toggleAmenity = (a) =>
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "capacity" || name === "floor") v = parseInt(value) || 1;
    setForm((prev) => ({ ...prev, [name]: v }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-sm font-medium text-gray-700">Hostel</label>
          <select
            name="hostelId"
            value={form.hostelId}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select hostel</option>
            {hostels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Room Number
          </label>
          <input
            name="number"
            value={form.number}
            onChange={handleChange}
            className="input"
            placeholder="e.g. 101"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Block</label>
          <select
            name="block"
            value={form.block}
            onChange={handleChange}
            className="input"
          >
            {availableBlocks.map((b) => (
              <option key={b} value={b}>
                Block {b}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="input"
          >
            {ROOM_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            className="input"
            min={1}
            max={6}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Floor</label>
          <input
            type="number"
            name="floor"
            value={form.floor}
            onChange={handleChange}
            className="input"
            min={1}
            max={10}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES_OPTIONS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAmenity(a)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${form.amenities.includes(a) ? "bg-navy-700 text-white border-navy-700" : "bg-white text-gray-600 border-gray-200 hover:border-navy-400"}`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initial.id ? "Save Changes" : "Add Room"}
        </Button>
      </div>
    </form>
  );
}

RoomForm.propTypes = {
  initial: shape({
    hostelId: string,
    number: number,
    block: string,
    type: string,
    capacity: number,
    floor: number,
    amenities: array,
  }),
  hostels: array,
  onSubmit: func,
  onCancel: func,
  loading: bool,
};

export default function AdminRooms() {
  const { hostels, rooms, allocations, addRoom, updateRoom, deleteRoom } =
    useData();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterHostel, setFilterHostel] = useState("all");
  const [addModal, setAddModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const getHostelName = (id) => hostels.find((h) => h.id === id)?.name || "—";

  const filtered = rooms.filter((r) => {
    const matchSearch = `${r.block}${r.number} ${r.type}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchHostel = filterHostel === "all" || r.hostelId === filterHostel;
    return matchSearch && matchStatus && matchHostel;
  });

  const getOccupancy = (roomId) =>
    allocations.filter((a) => a.roomId === roomId && a.status === "active")
      .length;

  const handleAdd = async (data) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    addRoom(data);
    setLoading(false);
    setAddModal(false);
    setAlert({ type: "success", msg: "Room added." });
  };
  const handleEdit = async (data) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    updateRoom(editRoom.id, data);
    setLoading(false);
    setEditRoom(null);
    setAlert({ type: "success", msg: "Room updated." });
  };
  const handleDelete = () => {
    deleteRoom(deleteId);
    setDeleteId(null);
    setAlert({ type: "success", msg: "Room deleted." });
  };

  return (
    <div>
      <PageHeader
        title="Rooms"
        subtitle={`${rooms.length} rooms across all hostels`}
        actions={
          <Button onClick={() => setAddModal(true)}>
            <Plus size={14} /> Add Room
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
            placeholder="Search rooms..."
          />
        </div>
        <select
          value={filterHostel}
          onChange={(e) => setFilterHostel(e.target.value)}
          className="input sm:w-48"
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
          className="input sm:w-40"
        >
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Room
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Hostel
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Type
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Floor
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Occupancy
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Status
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Amenities
              </th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const occ = getOccupancy(r.id);
              return (
                <tr key={r.id} className="table-row">
                  <td className="py-3.5 pr-4 font-mono font-medium text-navy-800">
                    Block {r.block} · {r.number}
                  </td>
                  <td className="py-3.5 pr-4 text-gray-600 text-xs max-w-35 truncate">
                    {getHostelName(r.hostelId)}
                  </td>
                  <td className="py-3.5 pr-4 text-gray-700">{r.type}</td>
                  <td className="py-3.5 pr-4 text-gray-700">{r.floor}</td>
                  <td className="py-3.5 pr-4">
                    <span className="text-gray-700">
                      {occ}/{r.capacity}
                    </span>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-navy-500 rounded-full"
                        style={{ width: `${(occ / r.capacity) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 pr-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {r.amenities.slice(0, 2).map((a) => (
                        <Badge key={a} variant="default">
                          {a}
                        </Badge>
                      ))}
                      {r.amenities.length > 2 && (
                        <Badge variant="default">
                          +{r.amenities.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditRoom(r)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(r.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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
                  No rooms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={addModal}
        onClose={() => setAddModal(false)}
        title="Add New Room"
      >
        <RoomForm
          hostels={hostels}
          onSubmit={handleAdd}
          onCancel={() => setAddModal(false)}
          loading={loading}
        />
      </Modal>
      <Modal
        open={!!editRoom}
        onClose={() => setEditRoom(null)}
        title="Edit Room"
      >
        {editRoom && (
          <RoomForm
            initial={editRoom}
            hostels={hostels}
            onSubmit={handleEdit}
            onCancel={() => setEditRoom(null)}
            loading={loading}
          />
        )}
      </Modal>
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Room"
      >
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete this room?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Room
          </Button>
        </div>
      </Modal>
    </div>
  );
}
