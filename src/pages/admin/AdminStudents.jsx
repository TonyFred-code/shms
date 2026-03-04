import { useState } from "react";
import { Search, UserCheck, UserX, BedDouble, UserPlus } from "lucide-react";
import { bool, func } from "prop-types";
import { useData } from "../../hooks/useData.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Button from "../../components/ui/Button.jsx";
import Avatar from "../../components/ui/Avatar.jsx";
import Modal from "../../components/ui/Modal.jsx";

const COURSES = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Business Administration",
  "Medicine",
  "Law",
  "Economics",
  "Architecture",
  "Mathematics",
  "Physics",
  "Chemistry",
];

function AddStudentForm({ onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    year: 1,
    password: "student123",
  });
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Full Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="input"
          placeholder="e.g. Chukwuemeka Obi"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input"
            placeholder="student@university.ac"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="input"
            placeholder="+234..."
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Course</label>
          <select
            name="course"
            value={form.course}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="">Select course</option>
            {COURSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Year</label>
          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            className="input"
          >
            {[1, 2, 3, 4, 5, 6].map((y) => (
              <option key={y} value={y}>
                Year {y}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">
          Temp. Password
        </label>
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          className="input"
          placeholder="Temporary password"
          required
        />
        <p className="text-xs text-gray-400">
          Student can change this on first login.
        </p>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Add Student
        </Button>
      </div>
    </form>
  );
}

AddStudentForm.propTypes = {
  onSubmit: func,
  onCancel: func,
  loading: bool,
};

export default function AdminStudents() {
  const {
    users,
    hostels,
    rooms,
    allocations,
    addUser,
    allocateRoom,
    deallocateRoom,
  } = useData();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [allocModal, setAllocModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const students = users.filter((u) => u.role === "student");
  const filtered = students.filter((s) =>
    `${s.name} ${s.email} ${s.studentId} ${s.course}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getStudentAllocation = (studentId) =>
    allocations.find((a) => a.studentId === studentId && a.status === "active");
  const getRoom = (roomId) => rooms.find((r) => r.id === roomId);
  const getHostelName = (id) => hostels.find((h) => h.id === id)?.name || "—";

  const availableRooms = rooms.filter((r) => {
    if (r.status === "maintenance") return false;
    const occ = allocations.filter(
      (a) => a.roomId === r.id && a.status === "active"
    ).length;
    return occ < r.capacity;
  });

  const handleAddStudent = async (data) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const newUser = {
      ...data,
      id: `u${Date.now()}`,
      role: "student",
      studentId: `STU-${new Date().getFullYear()}-${String(users.length).padStart(3, "0")}`,
      avatar: data.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      joinDate: new Date().toISOString().split("T")[0],
    };
    addUser(newUser);
    setLoading(false);
    setAddModal(false);
    setAlert({
      type: "success",
      msg: `Student ${data.name} added successfully. ID: ${newUser.studentId}`,
    });
  };

  const handleAllocate = async () => {
    if (!selectedRoom) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = allocateRoom(allocModal.student.id, selectedRoom);
    setLoading(false);
    if (!result.success) {
      setAlert({ type: "error", msg: result.error });
      return;
    }
    setAllocModal(null);
    setSelectedRoom("");
    setAlert({
      type: "success",
      msg: `Room allocated to ${allocModal.student.name}.`,
    });
  };

  const handleDeallocate = (allocId, studentName) => {
    deallocateRoom(allocId);
    setAlert({ type: "success", msg: `Room deallocated from ${studentName}.` });
    setSelected(null);
  };

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle={`${students.length} registered students`}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2">
              <UserCheck size={14} className="text-emerald-500" />
              {allocations.filter((a) => a.status === "active").length}{" "}
              allocated
            </div>
            <Button onClick={() => setAddModal(true)}>
              <UserPlus size={14} /> Add Student
            </Button>
          </div>
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

      <div className="relative mb-5">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9"
          placeholder="Search by name, email, course..."
        />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Student
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                ID
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Course
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Room / Hostel
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Joined
              </th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const alloc = getStudentAllocation(s.id);
              const room = alloc ? getRoom(alloc.roomId) : null;
              return (
                <tr
                  key={s.id}
                  className="table-row cursor-pointer"
                  onClick={() => setSelected(s)}
                >
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={s.avatar} size="sm" />
                      <div>
                        <p className="font-medium text-gray-800">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-xs text-gray-600">
                    {s.studentId}
                  </td>
                  <td className="py-3.5 pr-4 text-gray-600">
                    {s.course || "—"}
                  </td>
                  <td className="py-3.5 pr-4">
                    {room ? (
                      <div>
                        <div className="flex items-center gap-1.5">
                          <BedDouble size={13} className="text-navy-500" />
                          <span className="font-mono text-navy-700 text-xs">
                            Block {room.block} · {room.number}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {getHostelName(alloc?.hostelId)}
                        </p>
                      </div>
                    ) : (
                      <span className="text-amber-600 text-xs flex items-center gap-1">
                        <UserX size={13} /> Unallocated
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 pr-4 text-gray-500">{s.joinDate}</td>
                  <td className="py-3.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAllocModal({ student: s });
                        setSelectedRoom("");
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-navy-50 text-navy-700 hover:bg-navy-100 transition-colors font-medium"
                    >
                      {alloc ? "Change Room" : "Allocate"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-gray-400 text-sm"
                >
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      <Modal
        open={addModal}
        onClose={() => setAddModal(false)}
        title="Add New Student"
      >
        <AddStudentForm
          onSubmit={handleAddStudent}
          onCancel={() => setAddModal(false)}
          loading={loading}
        />
      </Modal>

      {/* Student Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Student Profile"
      >
        {selected &&
          (() => {
            const alloc = getStudentAllocation(selected.id);
            const room = alloc ? getRoom(alloc.roomId) : null;
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-navy-50 rounded-xl">
                  <Avatar initials={selected.avatar} size="lg" />
                  <div>
                    <p className="font-display text-lg text-navy-950">
                      {selected.name}
                    </p>
                    <p className="text-sm text-gray-500">{selected.email}</p>
                    <p className="text-xs font-mono text-gray-400 mt-0.5">
                      {selected.studentId}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Course</p>
                    <p>{selected.course || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Year</p>
                    <p>Year {selected.year}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p>{selected.phone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Joined</p>
                    <p>{selected.joinDate}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Room Allocation</p>
                  {room ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <BedDouble size={16} className="text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Block {room.block} · Room {room.number}
                          </p>
                          <p className="text-xs text-green-600">
                            {getHostelName(alloc?.hostelId)} · {room.type} ·
                            Since {alloc.startDate}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleDeallocate(alloc.id, selected.name)
                        }
                        className="text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Deallocate
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl p-3">
                      No room allocated.
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
      </Modal>

      {/* Allocate Modal */}
      <Modal
        open={!!allocModal}
        onClose={() => setAllocModal(null)}
        title={`Allocate Room — ${allocModal?.student?.name}`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Select Available Room
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="input"
            >
              <option value="">Choose a room...</option>
              {availableRooms.map((r) => {
                const occ = allocations.filter(
                  (a) => a.roomId === r.id && a.status === "active"
                ).length;
                const hostel = hostels.find((h) => h.id === r.hostelId);
                return (
                  <option key={r.id} value={r.id}>
                    {hostel?.name} · Block {r.block} · Room {r.number} ·{" "}
                    {r.type} ({occ}/{r.capacity})
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setAllocModal(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleAllocate}
              loading={loading}
              disabled={!selectedRoom}
            >
              Confirm Allocation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
