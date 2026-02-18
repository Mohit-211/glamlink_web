interface BadgeRendererProps {
  value: any;
  column: any;
}

export default function BadgeRenderer({ value, column }: BadgeRendererProps) {
  const { colors = {} } = column;
  const colorConfig = colors[value] || { bg: 'bg-gray-100', text: 'text-gray-800' };

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorConfig.bg} ${colorConfig.text}`}>
      {value}
    </span>
  );
}