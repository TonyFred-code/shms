import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Building2, CheckCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useData } from "../../hooks/useData.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import Badge, { StatusBadge } from "../../components/ui/Badge.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Button from "../../components/ui/Button.jsx";

const ACADEMIC_YEARS = ["2024/2025", "2025/2026"];
const ROOM_TYPES = ["Single", "Double", "Triple"];

export default function StudentApply() {
  const { user } = useAuth();
  const {
    hostels,
    rooms,
    feeConfigs,
    applications,
    allocations,
    submitApplication,
  } = useData();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    hostelId: "",
    preferredRoomType: "Single",
    academicYear: "2024/2025",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const myActiveApplication = applications.find(
    (a) => a.studentId === user.id && ["pending", "approved"].includes(a.status)
  );
  const myAllocation = allocations.find(
    (a) => a.studentId === user.id && a.status === "active"
  );

  // const selectedHostel = hostels.find((h) => h.id === form.hostelId);
  const feeConfig = feeConfigs.find(
    (f) => f.hostelId === form.hostelId && f.academicYear === form.academicYear
  );

  const availableRooms = rooms.filter((r) => {
    if (r.hostelId !== form.hostelId) return false;
    if (r.type !== form.preferredRoomType) return false;
    if (r.status === "maintenance") return false;
    const occ = allocations.filter(
      (a) => a.roomId === r.id && a.status === "active"
    ).length;
    return occ < r.capacity;
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.hostelId) {
      setError("Please select a hostel.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = submitApplication({
      ...form,
      studentId: user.id,
      studentName: user.name,
    });
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate("/student/dashboard"), 2500);
  };

  // Already allocated
  if (myAllocation) {
    const room = rooms.find((r) => r.id === myAllocation.roomId);
    const hostel = hostels.find((h) => h.id === myAllocation.hostelId);
    return (
      <div>
        <PageHeader title="Accommodation Application" />
        <div className="card text-center py-12 max-w-md mx-auto">
          <CheckCircle size={40} className="mx-auto mb-4 text-emerald-500" />
          <p className="font-display text-xl text-navy-950">
            Already Allocated
          </p>
          <p className="text-sm text-gray-500 mt-2">
            You are currently in <strong>{hostel?.name}</strong>, Block{" "}
            {room?.block}, Room {room?.number}.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Contact admin if you need to change your room.
          </p>
        </div>
      </div>
    );
  }

  // Pending/approved application
  if (myActiveApplication) {
    const hostel = hostels.find((h) => h.id === myActiveApplication.hostelId);
    return (
      <div>
        <PageHeader title="Accommodation Application" />
        <div className="card max-w-md mx-auto">
          <div className="text-center py-6">
            <FileText size={36} className="mx-auto mb-3 text-navy-500" />
            <p className="font-display text-xl text-navy-950">
              Application Submitted
            </p>
            <p className="text-sm text-gray-500 mt-2">
              You already have an active application for{" "}
              {myActiveApplication.academicYear}.
            </p>
          </div>
          <div className="space-y-3 border-t pt-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">Hostel Requested</p>
                <p className="font-medium">{hostel?.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Room Type</p>
                <p>{myActiveApplication.preferredRoomType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Academic Year</p>
                <p>{myActiveApplication.academicYear}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <StatusBadge status={myActiveApplication.status} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Submitted</p>
                <p>{myActiveApplication.submittedAt}</p>
              </div>
              {myActiveApplication.reviewedAt && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Reviewed</p>
                  <p>{myActiveApplication.reviewedAt}</p>
                </div>
              )}
            </div>
            {myActiveApplication.reviewNote && (
              <div
                className={`p-3 rounded-xl text-sm ${myActiveApplication.status === "approved" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}
              >
                <p className="font-medium mb-0.5">Note from Admin</p>
                <p>{myActiveApplication.reviewNote}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div>
        <PageHeader title="Accommodation Application" />
        <div className="card text-center py-12 max-w-md mx-auto">
          <CheckCircle size={40} className="mx-auto mb-4 text-emerald-500" />
          <p className="font-display text-xl text-navy-950">
            Application Submitted!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Your application is now pending review. You&apos;ll be notified once
            it&apos;s processed.
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Apply for Accommodation"
        subtitle="Submit your hostel accommodation request"
      />

      <div className="max-w-xl">
        {error && (
          <div className="mb-4">
            <Alert type="error" message={error} onClose={() => setError("")} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Hostel Selection */}
          <div className="card">
            <h3 className="font-display text-navy-950 mb-4">Select Hostel</h3>
            <div className="space-y-3">
              {hostels.map((h) => {
                const hostelRooms = rooms.filter((r) => r.hostelId === h.id);
                const available = hostelRooms.filter(
                  (r) => r.status === "available"
                ).length;
                const fc = feeConfigs.find(
                  (f) =>
                    f.hostelId === h.id && f.academicYear === form.academicYear
                );
                return (
                  <label
                    key={h.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.hostelId === h.id
                        ? "border-navy-600 bg-navy-50"
                        : "border-gray-200 hover:border-navy-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="hostelId"
                      value={h.id}
                      checked={form.hostelId === h.id}
                      onChange={handleChange}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 size={14} className="text-navy-600" />
                        <span className="font-medium text-gray-800">
                          {h.name}
                        </span>
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
                      </div>
                      {h.description && (
                        <p className="text-xs text-gray-500 mb-2">
                          {h.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{available} rooms available</span>
                        {fc && (
                          <span className="text-emerald-600 font-medium">
                            ₦{fc.totalAmount.toLocaleString()} / year ·{" "}
                            {fc.instalments.length} instalment(s)
                          </span>
                        )}
                        {!fc && (
                          <span className="text-amber-600">
                            No fee config for {form.academicYear}
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Preferences */}
          <div className="card">
            <h3 className="font-display text-navy-950 mb-4">Preferences</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Preferred Room Type
                </label>
                <select
                  name="preferredRoomType"
                  value={form.preferredRoomType}
                  onChange={handleChange}
                  className="input"
                >
                  {ROOM_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {form.hostelId && (
                  <p className="text-xs text-gray-400">
                    {availableRooms.length} {form.preferredRoomType} room(s)
                    available in selected hostel
                  </p>
                )}
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
            <div className="flex flex-col gap-1.5 mt-4">
              <label className="text-sm font-medium text-gray-700">
                Additional Notes (optional)
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="input min-h-20"
                placeholder="Any special requirements or information for the admin..."
              />
            </div>
          </div>

          {/* Fee Summary */}
          {feeConfig && (
            <div className="card bg-navy-50 border-navy-200">
              <h3 className="font-display text-navy-950 mb-3">Fee Summary</h3>
              <p className="text-xs text-gray-500 mb-3">
                If approved, the following payment schedule will apply:
              </p>
              <div className="space-y-2">
                {feeConfig.instalments.map((inst) => (
                  <div
                    key={inst.number}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-700">{inst.label}</span>
                    <div className="text-right">
                      <span className="font-mono font-medium text-navy-800">
                        ₦{inst.amount.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        Due: {inst.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between font-medium text-navy-800 pt-2 border-t border-navy-200">
                  <span>Total Annual Fee</span>
                  <span className="font-mono">
                    ₦{feeConfig.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            className="w-full justify-center"
            disabled={!form.hostelId}
          >
            <FileText size={15} /> Submit Application
          </Button>
        </form>
      </div>
    </div>
  );
}
