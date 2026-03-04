import { X } from "lucide-react";
import { bool, func, node, string } from "prop-types";

export default function Modal({
  open,
  onClose,
  title,
  children,
  width = "max-w-lg",
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${width} animate-slide-up max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-display text-navy-950">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  open: bool.isRequired,
  onClose: func.isRequired,
  title: string.isRequired,
  children: node.isRequired,
  width: string,
};
