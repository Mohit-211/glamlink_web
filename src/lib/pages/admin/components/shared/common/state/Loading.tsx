"use client";

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  height?: string; // For custom container height
}

export default function Loading({
  message = "Loading...",
  size = 'md',
  className = "",
  height = "h-64"
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  return (
    <div className={`flex items-center justify-center ${height} ${className}`}>
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-glamlink-teal`}></div>
      <span className="ml-3 text-gray-600">{message}</span>
    </div>
  );
}
