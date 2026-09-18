import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

/** Shared empty-state block — no results, no data yet, no related content, etc. */
const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) => {
  return (
    <div
      className={`flex flex-col items-center gap-3 py-20 text-center ${className}`}
    >
      <Icon className="h-8 w-8 text-gray-300" />
      <p className="text-sm font-medium text-gray-800">{title}</p>
      {description && (
        <p className="max-w-sm text-xs text-gray-400">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="text-xs font-medium text-[#24bbcb] hover:underline mt-1"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
