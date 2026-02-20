interface SuccessProps {
  message: string;
  show: boolean;
  className?: string;
}

export default function Success({ message, show, className = '' }: SuccessProps) {
  if (!show) return null;

  return (
    <div className={`mb-4 bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center">
        <svg className="h-5 w-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="ml-3 text-sm text-green-800 font-medium">{message}</p>
      </div>
    </div>
  );
}
