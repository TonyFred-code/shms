import { useState } from "react";
import { Plus, CreditCard, Edit2, Trash2, Zap } from "lucide-react";
import Button from "../../components/ui/Button.jsx";
import { useData } from "../../hooks/useData.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { array, bool, func, object, oneOf, shape, string } from "prop-types";

const ACADEMIC_YEARS = ["2023/2024", "2024/2025", "2025/2026"];

function FeeForm({ initial = {}, hostels, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    hostelId: initial.hostelId || "",
    academicYear: initial.academicYear || "2024/2025",
    instalments: initial.instalments || [
      { number: 1, label: "First Instalment", amount: "", dueDate: "" },
    ],
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleInstalmentChange = (i, field, value) => {
    setForm((prev) => ({
      ...prev,
      instalments: prev.instalments.map((inst, idx) =>
        idx === i
          ? {
              ...inst,
              [field]: field === "amount" ? parseInt(value) || "" : value,
            }
          : inst
      ),
    }));
  };

  const addInstalment = () => {
    const next = form.instalments.length + 1;
    const labels = ["First", "Second", "Third", "Fourth"];
    setForm((prev) => ({
      ...prev,
      instalments: [
        ...prev.instalments,
        {
          number: next,
          label: `${labels[next - 1] || next + "th"} Instalment`,
          amount: "",
          dueDate: "",
        },
      ],
    }));
  };

  const removeInstalment = (i) => {
    if (form.instalments.length === 1) return;
    setForm((prev) => ({
      ...prev,
      instalments: prev.instalments
        .filter((_, idx) => idx !== i)
        .map((inst, idx) => ({ ...inst, number: idx + 1 })),
    }));
  };

  const total = form.instalments.reduce(
    (s, i) => s + (parseInt(i.amount) || 0),
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, totalAmount: total });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
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
            Academic Year
          </label>
          <select
            name="academicYear"
            value={form.academicYear}
            onChange={handleChange}
            className="input"
          >
            {ACADEMIC_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Payment Instalments
          </label>
          <button
            type="button"
            onClick={addInstalment}
            className="text-xs text-navy-600 hover:text-navy-800 font-medium flex items-center gap-1"
          >
            <Plus size={12} /> Add instalment
          </button>
        </div>
        <div className="space-y-3">
          {form.instalments.map((inst, i) => (
            <div
              key={i}
              className="flex gap-2 items-end p-3 bg-gray-50 rounded-xl"
            >
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-xs text-gray-500">Label</label>
                <input
                  value={inst.label}
                  onChange={(e) =>
                    handleInstalmentChange(i, "label", e.target.value)
                  }
                  className="input text-sm py-1.5"
                />
              </div>
              <div className="w-32 flex flex-col gap-1">
                <label className="text-xs text-gray-500">Amount (₦)</label>
                <input
                  type="number"
                  value={inst.amount}
                  onChange={(e) =>
                    handleInstalmentChange(i, "amount", e.target.value)
                  }
                  className="input text-sm py-1.5"
                  placeholder="0"
                  min={0}
                  required
                />
              </div>
              <div className="w-36 flex flex-col gap-1">
                <label className="text-xs text-gray-500">Due Date</label>
                <input
                  type="date"
                  value={inst.dueDate}
                  onChange={(e) =>
                    handleInstalmentChange(i, "dueDate", e.target.value)
                  }
                  className="input text-sm py-1.5"
                  required
                />
              </div>
              {form.instalments.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstalment(i)}
                  className="pb-1.5 text-red-400 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        {total > 0 && (
          <div className="mt-2 text-right text-sm font-medium text-navy-700">
            Total: ₦{total.toLocaleString()}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initial.id ? "Save Changes" : "Save Fee Config"}
        </Button>
      </div>
    </form>
  );
}

FeeForm.propTypes = {
  initial: shape({
    hostelId: string,
    academicYear: oneOf(Object.keys(ACADEMIC_YEARS)),
    instalments: object,
  }),
  hostels: array,
  onSubmit: func,
  onCancel: func,
  loading: bool,
};

export default function AdminFees() {
  const {
    hostels,
    feeConfigs,
    allocations,
    payments,
    addFeeConfig,
    updateFeeConfig,
    deleteFeeConfig,
    generatePaymentsForFeeConfig,
  } = useData();
  const [addModal, setAddModal] = useState(false);
  const [editConfig, setEditConfig] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const getHostel = (id) => hostels.find((h) => h.id === id);

  const handleAdd = async (data) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    addFeeConfig(data);
    setLoading(false);
    setAddModal(false);
    setAlert({ type: "success", msg: "Fee configuration saved." });
  };

  const handleEdit = async (data) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    updateFeeConfig(editConfig.id, data);
    setLoading(false);
    setEditConfig(null);
    setAlert({ type: "success", msg: "Fee configuration updated." });
  };

  const handleDelete = () => {
    deleteFeeConfig(deleteId);
    setDeleteId(null);
    setAlert({ type: "success", msg: "Fee configuration deleted." });
  };

  const handleGenerate = async (fcId) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = generatePaymentsForFeeConfig(fcId);
    setLoading(false);
    setAlert(
      result.success
        ? {
            type: "success",
            msg: `Generated ${result.generated} new payment record(s).`,
          }
        : { type: "error", msg: result.error }
    );
  };

  return (
    <div>
      <PageHeader
        title="Fee Configuration"
        subtitle="Set accommodation fees per hostel per academic year"
        actions={
          <Button onClick={() => setAddModal(true)}>
            <Plus size={14} /> New Config
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

      {feeConfigs.length === 0 ? (
        <div className="card text-center py-16">
          <CreditCard size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="font-display text-xl text-gray-600">
            No fee configurations yet
          </p>
          <p className="text-sm text-gray-400 mt-1 mb-4">
            Create a fee config for each hostel and academic year.
          </p>
          <Button onClick={() => setAddModal(true)}>
            <Plus size={14} /> Add First Config
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {feeConfigs.map((fc) => {
            const hostel = getHostel(fc.hostelId);
            const activeAllocs = allocations.filter(
              (a) =>
                a.hostelId === fc.hostelId &&
                a.academicYear === fc.academicYear &&
                a.status === "active"
            ).length;
            const existingPayments = payments.filter(
              (p) => p.feeConfigId === fc.id
            );
            const paid = existingPayments.filter(
              (p) => p.status === "paid"
            ).length;
            const totalExpected = activeAllocs * fc.instalments.length;

            return (
              <div key={fc.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-display text-navy-950">
                        {hostel?.name || "Unknown Hostel"}
                      </p>
                      <Badge variant="navy">{fc.academicYear}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Total fee:{" "}
                      <span className="font-medium text-gray-800">
                        ₦{fc.totalAmount.toLocaleString()}
                      </span>{" "}
                      · {fc.instalments.length} instalment(s)
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleGenerate(fc.id)}
                      disabled={loading}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium"
                      title="Auto-generate payment records for all allocated students"
                    >
                      <Zap size={12} /> Generate Payments
                    </button>
                    <button
                      onClick={() => setEditConfig(fc)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(fc.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid gap-2">
                  {fc.instalments.map((inst) => (
                    <div
                      key={inst.number}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl text-sm"
                    >
                      <div className="w-6 h-6 rounded-full bg-navy-100 text-navy-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {inst.number}
                      </div>
                      <span className="flex-1 text-gray-700">{inst.label}</span>
                      <span className="font-mono font-medium text-gray-800">
                        ₦{inst.amount.toLocaleString()}
                      </span>
                      <span className="text-gray-400">Due: {inst.dueDate}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {activeAllocs} allocated students · {totalExpected} expected
                    payment records
                  </span>
                  <span>
                    {paid}/{existingPayments.length} payments collected
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={addModal}
        onClose={() => setAddModal(false)}
        title="New Fee Configuration"
        width="max-w-2xl"
      >
        <FeeForm
          hostels={hostels}
          onSubmit={handleAdd}
          onCancel={() => setAddModal(false)}
          loading={loading}
        />
      </Modal>
      <Modal
        open={!!editConfig}
        onClose={() => setEditConfig(null)}
        title="Edit Fee Configuration"
        width="max-w-2xl"
      >
        {editConfig && (
          <FeeForm
            initial={editConfig}
            hostels={hostels}
            onSubmit={handleEdit}
            onCancel={() => setEditConfig(null)}
            loading={loading}
          />
        )}
      </Modal>
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Fee Config"
      >
        <p className="text-sm text-gray-600 mb-5">
          This will delete the fee configuration. Existing payment records will
          not be affected.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
