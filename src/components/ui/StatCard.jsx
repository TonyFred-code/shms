import { node, oneOf, string } from "prop-types";

const colorMap = {
  navy: "bg-navy-50 text-navy-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-600",
  purple: "bg-purple-50 text-purple-700",
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  color = "navy",
  sub,
}) {
  return (
    <div className="stat-card animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-display text-navy-950 mt-0.5">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}
          >
            <Icon size={18} />
          </div>
        )}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  label: string.isRequired,
  value: string.isRequired,
  color: oneOf(Object.keys(colorMap)),
  icon: node,
  sub: string,
};
