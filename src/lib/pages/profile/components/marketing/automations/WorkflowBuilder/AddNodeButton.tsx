/**
 * AddNodeButton Component
 *
 * Button for adding nodes to workflow
 */

'use client';

interface AddNodeButtonProps {
  label: string;
  onClick: () => void;
  icon: string;
}

export function AddNodeButton({ label, onClick, icon }: AddNodeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors text-sm font-medium text-gray-700 hover:text-pink-600 flex items-center space-x-2"
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default AddNodeButton;
