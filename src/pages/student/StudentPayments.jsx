import {
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Clock,
  Building2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useData } from "../../hooks/useData.jsx";
import PageHeader from "../../components/ui/PageHeader.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Badge, { StatusBadge } from "../../components/ui/Badge.jsx";

export default function StudentPayments() {
  const { user } = useAuth();
  // const { payments, hostels, feeConfigs, allocations } = useData();
  const { payments, hostels } = useData();

  const myPayments = payments
    .filter((p) => p.studentId === user.id)
    .sort((a, b) => a.instalmentNumber - b.instalmentNumber);

  const paid = myPayments.filter((p) => p.status === "paid");
  const pending = myPayments.filter((p) => p.status !== "paid");
  const overdue = myPayments.filter((p) => p.status === "overdue");
  const totalPaid = paid.reduce((s, p) => s + p.amount, 0);
  const totalPending = pending.reduce((s, p) => s + p.amount, 0);

  const fmt = (n) => `₦${n.toLocaleString()}`;

  // Group by academic year
  const grouped = myPayments.reduce((acc, p) => {
    const key = `${p.academicYear}__${p.hostelId}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  const getHostelName = (id) => hostels.find((h) => h.id === id)?.name || "—";

  return (
    <div>
      <PageHeader
        title="Fee Payments"
        subtitle="Your accommodation payment schedule and history"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Paid"
          value={fmt(totalPaid)}
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          label="Outstanding"
          value={fmt(totalPending)}
          icon={AlertTriangle}
          color={
            overdue.length > 0 ? "red" : totalPending > 0 ? "amber" : "emerald"
          }
        />
        <StatCard
          label="Instalments Paid"
          value={paid.length}
          icon={CreditCard}
          color="navy"
        />
        <StatCard
          label="Overdue"
          value={overdue.length}
          icon={Clock}
          color={overdue.length > 0 ? "red" : "emerald"}
        />
      </div>

      {myPayments.length === 0 ? (
        <div className="card text-center py-16">
          <CreditCard size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="font-display text-xl text-gray-600">
            No Payment Records
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Payment records are generated when you are allocated a room.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([key, groupPayments]) => {
            const [year, hostelId] = key.split("__");
            const groupPaid = groupPayments
              .filter((p) => p.status === "paid")
              .reduce((s, p) => s + p.amount, 0);
            const groupTotal = groupPayments.reduce((s, p) => s + p.amount, 0);
            const allPaid = groupPayments.every((p) => p.status === "paid");

            return (
              <div key={key} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 size={14} className="text-navy-600" />
                      <h3 className="font-display text-navy-950">
                        {getHostelName(hostelId)}
                      </h3>
                      <Badge variant="navy">{year}</Badge>
                      {allPaid && <Badge variant="success">Fully Paid</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Paid: {fmt(groupPaid)} of {fmt(groupTotal)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-navy-600 rounded-full"
                        style={{ width: `${(groupPaid / groupTotal) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.round((groupPaid / groupTotal) * 100)}% paid
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          #
                        </th>
                        <th className="pb-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Instalment
                        </th>
                        <th className="pb-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Amount
                        </th>
                        <th className="pb-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Due Date
                        </th>
                        <th className="pb-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Paid Date
                        </th>
                        <th className="pb-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Method
                        </th>
                        <th className="pb-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupPayments.map((p) => (
                        <tr key={p.id} className="table-row">
                          <td className="py-3 pr-3">
                            <div className="w-6 h-6 rounded-full bg-navy-100 text-navy-700 text-xs font-bold flex items-center justify-center">
                              {p.instalmentNumber}
                            </div>
                          </td>
                          <td className="py-3 pr-4 font-medium text-gray-800">
                            {p.label}
                          </td>
                          <td className="py-3 pr-4 font-mono text-gray-700">
                            {fmt(p.amount)}
                          </td>
                          <td className="py-3 pr-4 text-gray-500">
                            {p.dueDate}
                          </td>
                          <td className="py-3 pr-4 text-gray-500">
                            {p.paidDate || (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                          <td className="py-3 pr-4 text-gray-500">
                            {p.method || (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                          <td className="py-3">
                            <StatusBadge status={p.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
