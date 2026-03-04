import { AlertCircle } from "lucide-react";
import { node, string } from "prop-types";
import { forwardRef } from "react";

export const Input = forwardRef(function Input(
  { label, error, className = "", ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        ref={ref}
        className={`input ${error ? "border-red-400 focus:ring-red-400" : ""} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </span>
      )}
    </div>
  );
});

Input.propTypes = {
  label: string,
  error: string,
  className: string,
};

export function Select({ label, error, children, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <select
        className={`input ${error ? "border-red-400" : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </span>
      )}
    </div>
  );
}

Select.propTypes = {
  label: string,
  error: string,
  children: node.isRequired,
  className: string,
};

export function Textarea({ label, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <textarea
        className={`input min-h-25 resize-y ${error ? "border-red-400" : ""} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </span>
      )}
    </div>
  );
}

Textarea.propTypes = {
  label: string,
  error: string,
  className: string,
};
