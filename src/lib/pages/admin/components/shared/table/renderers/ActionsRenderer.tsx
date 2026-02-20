import { EditIcon, StarIcon, EyeIcon, EyeOffIcon, DeleteIcon, SpinnerIcon, PlusIcon, UserGroupIcon } from '@/lib/pages/admin/components/shared/common';

interface ActionsRendererProps {
  row: any;
  column: any;
  onEdit?: (row: any) => void;
  onView?: (row: any) => void;
  onDelete?: (row: any) => void;
  onToggleFeatured?: (row: any) => void;
  onToggleVisibility?: (row: any) => void;
  onMoveUp?: (row: any) => void;
  onMoveDown?: (row: any) => void;
  onAddProfessional?: (row: any) => void;
  currentUserId?: string;
  loadingRowId?: string;
}

export default function ActionsRenderer({
  row,
  column,
  onEdit,
  onView,
  onDelete,
  onToggleFeatured,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  onAddProfessional,
  currentUserId,
  loadingRowId
}: ActionsRendererProps) {
  const { actions = ['edit', 'delete'] } = column;

  // Check if section is locked
  const isLocked = row.lockedBy && row.lockExpiresAt;
  const lockExpired = isLocked && new Date(row.lockExpiresAt) < new Date();
  const hasActiveLock = isLocked && !lockExpired;

  // Check if current user owns the lock
  const isLockedByCurrentUser = hasActiveLock && currentUserId && row.lockedBy === currentUserId;
  const isLockedByAnotherUser = hasActiveLock && !isLockedByCurrentUser;

  // Check if this row is currently loading
  const isRowLoading = loadingRowId === row.id;

  return (
    <div className="flex items-center gap-2">
      {actions.includes('moveUp') && onMoveUp && (
        <button
          onClick={() => !isRowLoading && onMoveUp(row)}
          disabled={isRowLoading}
          title="Move Up"
          className={`transition-colors ${
            isRowLoading
              ? 'text-gray-400 cursor-not-allowed opacity-50'
              : 'text-gray-400 hover:text-indigo-600'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {actions.includes('moveDown') && onMoveDown && (
        <button
          onClick={() => !isRowLoading && onMoveDown(row)}
          disabled={isRowLoading}
          title="Move Down"
          className={`transition-colors ${
            isRowLoading
              ? 'text-gray-400 cursor-not-allowed opacity-50'
              : 'text-gray-400 hover:text-indigo-600'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {actions.includes('view') && onView && (
        <button
          onClick={() => !isRowLoading && onView(row)}
          disabled={isRowLoading}
          className={`transition-colors ${
            isRowLoading
              ? 'text-indigo-600 cursor-wait'
              : 'text-indigo-600 hover:text-indigo-800'
          }`}
          title="View Details"
        >
          <EyeIcon />
        </button>
      )}

      {actions.includes('addProfessional') && onAddProfessional && row.canAddProfessional && (
        <button
          onClick={() => !isRowLoading && onAddProfessional(row)}
          disabled={isRowLoading}
          className={`transition-colors ${
            isRowLoading
              ? 'text-green-600 cursor-wait'
              : 'text-green-600 hover:text-green-800'
          }`}
          title="Add as Professional"
        >
          <UserGroupIcon className="h-4 w-4" />
        </button>
      )}

      {actions.includes('edit') && onEdit && (
        <button
          onClick={() => !isLockedByAnotherUser && !isRowLoading && onEdit(row)}
          disabled={isLockedByAnotherUser || isRowLoading}
          className={`transition-colors ${
            isRowLoading
              ? 'text-blue-600 cursor-wait'
              : isLockedByAnotherUser
              ? 'text-gray-400 cursor-not-allowed opacity-50'
              : 'text-blue-600 hover:text-blue-800'
          }`}
          title={
            isRowLoading
              ? 'Processing...'
              : isLockedByAnotherUser
              ? `Locked by ${row.lockedByName || 'another user'}`
              : isLockedByCurrentUser
              ? 'Edit (you have this section locked)'
              : 'Edit'
          }
        >
          {isRowLoading ? <SpinnerIcon className="h-4 w-4" /> : <EditIcon />}
        </button>
      )}

      {actions.includes('featured') && onToggleFeatured && (
        <button
          onClick={() => onToggleFeatured(row)}
          className={`${row.featured ? 'text-yellow-600 hover:text-yellow-800' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
          title={row.featured ? 'Remove from featured' : 'Add to featured'}
        >
          <StarIcon className={`h-4 w-4 ${row.featured ? 'fill-current' : ''}`} />
        </button>
      )}

      {actions.includes('visibility') && onToggleVisibility && (
        <button
          onClick={() => onToggleVisibility(row)}
          className={`${row.visible ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
          title={row.visible ? 'Hide' : 'Show'}
        >
          {row.visible ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      )}

      {actions.includes('delete') && onDelete && (
        <button
          onClick={() => !hasActiveLock && onDelete(row)}
          disabled={hasActiveLock}
          className={`transition-colors ${
            hasActiveLock
              ? 'text-gray-400 cursor-not-allowed opacity-50'
              : 'text-red-600 hover:text-red-800'
          }`}
          title={
            hasActiveLock
              ? isLockedByCurrentUser
                ? 'Cannot delete while you have this section locked'
                : `Locked by ${row.lockedByName || 'another user'}`
              : 'Delete'
          }
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
}