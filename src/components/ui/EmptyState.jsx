import { node, string } from "prop-types";

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <Icon size={24} className="text-gray-400" />
        </div>
      )}
      <p className="font-display text-lg text-gray-700 mb-1">{title}</p>
      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}

EmptyState.propTypes = {
  icon: node,
  title: string.isRequired,
  description: string,
  action: node.isRequired,
};
