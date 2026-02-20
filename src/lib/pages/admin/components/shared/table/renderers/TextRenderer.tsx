interface TextRendererProps {
  value: any;
  className?: string;
}

export default function TextRenderer({ value, className = "text-sm text-gray-900" }: TextRendererProps) {
  return <span className={className}>{value || '-'}</span>;
}