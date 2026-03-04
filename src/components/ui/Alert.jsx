import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { func, oneOf, string } from "prop-types";

const configs = {
  success: {
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-800",
    Icon: CheckCircle,
  },
  error: {
    bg: "bg-red-50 border-red-200",
    text: "text-red-800",
    Icon: AlertCircle,
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-800",
    Icon: Info,
  },
  warning: {
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    Icon: AlertCircle,
  },
};

export default function Alert({ type = "info", message, onClose }) {
  const { bg, text, Icon } = configs[type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border ${bg} ${text} text-sm animate-fade-in`}
    >
      <Icon size={16} className="shrink-0 mt-0.5" />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="shrink-0 hover:opacity-70">
          <X size={14} />
        </button>
      )}
    </div>
  );
}

Alert.propTypes = {
  type: oneOf(Object.keys(configs)),
  message: string.isRequired,
  onClose: func.isRequired,
};
