import { node, oneOf } from "prop-types";

const variants = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
  navy: "bg-navy-100 text-navy-800",
  purple: "bg-purple-50 text-purple-700",
};

export default function Badge({ children, variant = "default" }) {
  return <span className={`badge ${variants[variant]}`}>{children}</span>;
}

Badge.propTypes = {
  children: node.isRequired,
  variant: oneOf(Object.keys(variants)),
};

const statusMap = {
  paid: { label: "Paid", variant: "success" },
  unpaid: { label: "Unpaid", variant: "warning" },
  overdue: { label: "Overdue", variant: "danger" },
  pending: { label: "Pending", variant: "warning" },
  "in-progress": { label: "In Progress", variant: "info" },
  resolved: { label: "Resolved", variant: "success" },
  available: { label: "Available", variant: "success" },
  occupied: { label: "Occupied", variant: "info" },
  maintenance: { label: "Maintenance", variant: "danger" },
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "default" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
};

export function StatusBadge({ status }) {
  const config = statusMap[status] || { label: status, variant: "default" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

StatusBadge.propTypes = {
  status: oneOf(Object.keys(statusMap)).isRequired,
};

const priorityMap = {
  high: { label: "High", variant: "danger" },
  medium: { label: "Medium", variant: "warning" },
  low: { label: "Low", variant: "default" },
};

export function PriorityBadge({ priority }) {
  const config = priorityMap[priority] || {
    label: priority,
    variant: "default",
  };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

PriorityBadge.propTypes = {
  priority: oneOf(Object.keys(priorityMap)).isRequired,
};
