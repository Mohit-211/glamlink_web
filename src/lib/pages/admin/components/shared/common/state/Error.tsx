"use client";

interface ErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
  title?: string;
}

export default function Error({
  message,
  onRetry,
  className = "",
  title = "Error"
}: ErrorProps) {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-md p-4 ${className}`}>
      <div className="flex">
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">{message}</div>
          {onRetry && (
            <div className="mt-3">
              <button
                onClick={onRetry}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
