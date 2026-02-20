/**
 * LoadingSpinner component for displaying loading states
 */
export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}

/**
 * LoadingOverlay component for full-screen or modal loading states
 * @param message - The loading message to display
 */
export function LoadingOverlay({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm">
      <LoadingSpinner />
      <p className="mt-4 text-gray-600 text-center">{message}</p>
    </div>
  );
}