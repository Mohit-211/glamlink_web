/**
 * ActionNode Component
 *
 * Displays action configuration in workflow builder
 */

'use client';

import { AutomationAction } from '@/lib/features/crm/marketing/types';

interface ActionNodeProps {
  action: AutomationAction;
  onChange: (updates: Partial<AutomationAction>) => void;
  onDelete: () => void;
  readOnly?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

const ACTION_LABELS: Record<AutomationAction['type'], { label: string; icon: string; color: string }> = {
  wait: { label: 'Wait', icon: '⏱️', color: 'gray' },
  send_email: { label: 'Send email', icon: '📧', color: 'green' },
  send_sms: { label: 'Send SMS', icon: '📱', color: 'blue' },
  add_tag: { label: 'Add tag', icon: '🏷️', color: 'purple' },
  remove_tag: { label: 'Remove tag', icon: '🏷️', color: 'orange' },
  webhook: { label: 'Webhook', icon: '🔗', color: 'indigo' },
};

export function ActionNode({ action, onChange, onDelete, readOnly, isSelected, onSelect }: ActionNodeProps) {
  const actionInfo = ACTION_LABELS[action.type];
  const bgColor = `bg-${actionInfo.color}-100`;
  const textColor = `text-${actionInfo.color}-600`;

  const getActionDescription = () => {
    switch (action.type) {
      case 'wait':
        return `Wait for ${action.config.duration} ${action.config.unit}`;
      case 'send_email':
        return action.config.subject || 'Configure email';
      case 'send_sms':
        return action.config.message ? 'SMS configured' : 'Configure SMS';
      default:
        return 'Configure action';
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`
        bg-white rounded-xl border-2 p-4 w-80 cursor-pointer transition-all
        ${isSelected ? 'border-pink-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <span>{actionInfo.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 uppercase font-medium mb-1">Action</div>
          <div className="font-medium text-gray-900 text-sm">{actionInfo.label}</div>
          <p className="text-xs text-gray-500 mt-1">{getActionDescription()}</p>
        </div>
        {!readOnly && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 text-gray-400 hover:text-red-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default ActionNode;
