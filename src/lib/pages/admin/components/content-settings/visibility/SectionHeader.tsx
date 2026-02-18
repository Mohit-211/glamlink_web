interface SectionHeaderProps {
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function SectionHeader({
  title,
  description,
  buttonText,
  onButtonClick
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="px-4 py-2 text-sm font-medium text-glamlink-teal border border-glamlink-teal rounded-md hover:bg-glamlink-teal hover:text-white transition-colors"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
