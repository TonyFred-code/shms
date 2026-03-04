import { Loader2 } from "lucide-react";
import { bool, node, oneOf, string } from "prop-types";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
  ghost:
    "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors",
};

export default function Button({
  children,
  variant = "primary",
  loading,
  className = "",
  disabled,
  ...props
}) {
  return (
    <button
      className={`${variants[variant] || variants.primary} ${className} disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer`}
      disabled={loading || disabled}
      aria-busy={loading}
      aria-disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: oneOf(Object.keys(variants)),
  className: string,
  children: node.isRequired,
  loading: bool,
  disabled: bool,
};
