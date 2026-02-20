/**
 * EmptyState component for displaying when no data is available
 * @param message - The message to display when content is empty
 */
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}