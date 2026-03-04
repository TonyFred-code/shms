import { useState } from "react";
import {
  CreditCard,
  Search,
  CheckCircle,
  AlertTriangle,
  Plus,
  Building2,
} from "lucide-react";
import { useData } from "../../hooks/useData.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Alert from "../../components/ui/Alert.jsx";
import { StatusBadge } from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";

const PAYMENT_METHODS = ["Bank Transfer", "Cash", "Online", "POS", "Cheque"];

export default function AdminPayments() {
  const {
    users,
    hostels,
    // feeConfigs,
    payments,
    allocations,
    updatePayment,
    addPayment,
  } = useData();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterHostel, setFilterHostel] = useState("all");
  const [selected, setSelected] = useState(null);
  const [method, setMethod] = useState("Bank Transfer");
  const [addModal, setAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    studentId: "",
    hostelId: "",
    label: "",
    amount: "",
    dueDate: "",
    feeConfigId: "",
    instalmentNumber: 1,
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const students = users.filter((u) => u.role === "student");
  const getName = (id) => students.find((s) => s.id === id)?.name || "Unknown";
  const getHostelName = (id) => hostels.find((h) => h.id === id)?.name || "—";

  const paid = payments.filter((p) => p.status === "paid").length;
  const unpaid = payments.filter((p) => p.status === "unpaid").length;
  const overdue = payments.filter((p) => p.status === "overdue").length;
  const totalCollected = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);
  const fmt = (n) => `₦${n.toLocaleString()}`;

  const filtered = payments
    .filter((p) => {
      const name = getName(p.studentId).toLowerCase();
      const matchSearch =
        name.includes(search.toLowerCase()) ||
        p.academicYear?.includes(search) ||
        p.label?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || p.status === filterStatus;
      const matchHostel = filterHostel === "all" || p.hostelId === filterHostel;
      return matchSearch && matchStatus && matchHostel;
    })
    .sort((a, b) => {
      // Sort by overdue first, then unpaid, then paid
      const order = { overdue: 0, unpaid: 1, paid: 2 };
      return (order[a.status] ?? 3) - (order[b.status] ?? 3);
    });

  const handleMarkPaid = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    updatePayment(selected.id, {
      status: "paid",
      paidDate: new Date().toISOString().split("T")[0],
      method,
    });
    setLoading(false);
    setSelected(null);
    setAlert({
      type: "success",
      msg: `Payment marked as paid for ${getName(selected.studentId)}.`,
    });
  };

  const handleMarkUnpaid = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    updatePayment(selected.id, {
      status: "unpaid",
      paidDate: null,
      method: null,
    });
    setLoading(false);
    setSelected(null);
    setAlert({ type: "success", msg: "Payment reverted to unpaid." });
  };

  const handleMarkOverdue = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    updatePayment(selected.id, { status: "overdue" });
    setLoading(false);
    setSelected(null);
    setAlert({ type: "success", msg: "Payment marked as overdue." });
  };

  const handleAddPayment = async () => {
    if (!addForm.studentId || !addForm.label || !addForm.amount) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const alloc = allocations.find(
      (a) => a.studentId === addForm.studentId && a.status === "active"
    );
    addPayment({
      ...addForm,
      allocationId: alloc?.id || null,
      hostelId: alloc?.hostelId || addForm.hostelId,
      academicYear: alloc?.academicYear || "2024/2025",
      amount: parseInt(addForm.amount),
      status: "unpaid",
      paidDate: null,
      method: null,
    });
    setLoading(false);
    setAddModal(false);
    setAddForm({
      studentId: "",
      hostelId: "",
      label: "",
      amount: "",
      dueDate: "",
      feeConfigId: "",
      instalmentNumber: 1,
    });
    setAlert({ type: "success", msg: "Payment record added." });
  };

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="Manage all accommodation fee payments"
        actions={
          <Button onClick={() => setAddModal(true)}>
            <Plus size={14} /> Add Payment
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Collected"
          value={fmt(totalCollected)}
          icon={CreditCard}
          color="emerald"
        />
        <StatCard
          label="Paid"
          value={paid}
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          label="Unpaid"
          value={unpaid}
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          label="Overdue"
          value={overdue}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Per-hostel collection summary */}
      <div className="grid md:grid-cols-3 gap-3 mb-5">
        {hostels.map((h) => {
          const hp = payments.filter((p) => p.hostelId === h.id);
          const hpaid = hp
            .filter((p) => p.status === "paid")
            .reduce((s, p) => s + p.amount, 0);
          const htotal = hp.reduce((s, p) => s + p.amount, 0);
          return (
            <div key={h.id} className="card py-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={14} className="text-navy-600" />
                <span className="text-sm font-medium text-gray-700 truncate">
                  {h.name}
                </span>
              </div>
              <p className="text-xl font-display text-navy-900">{fmt(hpaid)}</p>
              <p className="text-xs text-gray-400">of {fmt(htotal)} expected</p>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-navy-600 rounded-full"
                  style={{
                    width: htotal > 0 ? `${(hpaid / htotal) * 100}%` : "0%",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

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
            placeholder="Search by student name, instalment..."
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
          className="input sm:w-36"
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="overdue">Overdue</option>
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
                Instalment
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Amount
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Due
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Paid Date
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Method
              </th>
              <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                Status
              </th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="table-row">
                <td className="py-3.5 pr-3 font-medium text-gray-800">
                  {getName(p.studentId)}
                </td>
                <td className="py-3.5 pr-3 text-xs text-gray-500 max-w-30 truncate">
                  {getHostelName(p.hostelId)}
                </td>
                <td className="py-3.5 pr-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-navy-100 text-navy-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {p.instalmentNumber}
                    </div>
                    <span className="text-gray-700 text-xs">{p.label}</span>
                  </div>
                </td>
                <td className="py-3.5 pr-3 font-mono text-gray-700">
                  {fmt(p.amount)}
                </td>
                <td className="py-3.5 pr-3 text-gray-500 text-xs">
                  {p.dueDate}
                </td>
                <td className="py-3.5 pr-3 text-gray-500 text-xs">
                  {p.paidDate || "—"}
                </td>
                <td className="py-3.5 pr-3 text-gray-500 text-xs">
                  {p.method || "—"}
                </td>
                <td className="py-3.5 pr-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="py-3.5">
                  <button
                    onClick={() => {
                      setSelected(p);
                      setMethod("Bank Transfer");
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="py-12 text-center text-gray-400 text-sm"
                >
                  No payment records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Manage Payment Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Manage Payment"
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">Student</p>
                <p className="font-medium">{getName(selected.studentId)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Hostel</p>
                <p>{getHostelName(selected.hostelId)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Instalment</p>
                <p>
                  {selected.instalmentNumber} — {selected.label}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Amount</p>
                <p className="font-mono">{fmt(selected.amount)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Due Date</p>
                <p>{selected.dueDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <StatusBadge status={selected.status} />
              </div>
              {selected.paidDate && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Paid Date</p>
                  <p>{selected.paidDate}</p>
                </div>
              )}
              {selected.method && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Method</p>
                  <p>{selected.method}</p>
                </div>
              )}
            </div>

            {selected.status !== "paid" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="input"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-2 justify-end border-t pt-4 flex-wrap">
              <Button variant="secondary" onClick={() => setSelected(null)}>
                Close
              </Button>
              {selected.status !== "paid" && selected.status !== "overdue" && (
                <Button
                  variant="secondary"
                  onClick={handleMarkOverdue}
                  loading={loading}
                >
                  Mark Overdue
                </Button>
              )}
              {selected.status === "paid" ? (
                <Button
                  variant="danger"
                  onClick={handleMarkUnpaid}
                  loading={loading}
                >
                  Revert to Unpaid
                </Button>
              ) : (
                <Button onClick={handleMarkPaid} loading={loading}>
                  <CheckCircle size={14} /> Mark as Paid
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Manual Payment Modal */}
      <Modal
        open={addModal}
        onClose={() => setAddModal(false)}
        title="Add Payment Record"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Student</label>
            <select
              value={addForm.studentId}
              onChange={(e) =>
                setAddForm((p) => ({ ...p, studentId: e.target.value }))
              }
              className="input"
              required
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.studentId})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Label</label>
              <input
                value={addForm.label}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, label: e.target.value }))
                }
                className="input"
                placeholder="e.g. First Instalment"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Amount (₦)
              </label>
              <input
                type="number"
                value={addForm.amount}
                onChange={(e) =>
                  setAddForm((p) => ({ ...p, amount: e.target.value }))
                }
                className="input"
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              value={addForm.dueDate}
              onChange={(e) =>
                setAddForm((p) => ({ ...p, dueDate: e.target.value }))
              }
              className="input"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setAddModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddPayment}
              loading={loading}
              disabled={!addForm.studentId || !addForm.label || !addForm.amount}
            >
              Add Record
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
