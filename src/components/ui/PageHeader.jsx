import { node, string } from "prop-types";

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between mb-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display text-navy-950">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

PageHeader.propTypes = {
  title: string.isRequired,
  subtitle: string,
  actions: node,
};
