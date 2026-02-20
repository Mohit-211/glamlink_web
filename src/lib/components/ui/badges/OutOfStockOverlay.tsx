/**
 * OutOfStockOverlay component for products that are unavailable
 */
export function OutOfStockOverlay() {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <span className="bg-white px-4 py-2 rounded-md font-semibold text-gray-800">Out of Stock</span>
    </div>
  );
}