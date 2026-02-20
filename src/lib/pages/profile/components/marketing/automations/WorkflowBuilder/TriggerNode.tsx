/**
 * TriggerNode Component
 *
 * Displays trigger configuration in workflow builder
 */

'use client';

import { AutomationTrigger, AutomationTriggerType } from '@/lib/features/crm/marketing/types';

interface TriggerNodeProps {
  trigger: AutomationTrigger;
  onChange: (trigger: AutomationTrigger) => void;
  readOnly?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

const TRIGGER_TYPES: { type: AutomationTriggerType; label: string; description: string }[] = [
  {
    type: 'abandoned_checkout',
    label: 'Customer left online store without making a purchase',
    description: 'Triggers when a customer views products but doesn\'t complete checkout',
  },
  {
    type: 'abandoned_cart',
    label: 'Customer abandoned cart',
    description: 'Triggers when products are added to cart but not purchased',
  },
  {
    type: 'new_subscriber',
    label: 'New subscriber joined',
    description: 'Triggers when someone subscribes to your mailing list',
  },
  {
    type: 'post_purchase',
    label: 'Customer completed a purchase',
    description: 'Triggers after a successful order',
  },
  {
    type: 'customer_birthday',
    label: 'Customer birthday',
    description: 'Triggers on customer\'s birthday',
  },
];

export function TriggerNode({ trigger, onChange, readOnly, isSelected, onSelect }: TriggerNodeProps) {
  const triggerInfo = TRIGGER_TYPES.find(t => t.type === trigger.type);

  return (
    <div
      onClick={onSelect}
      className={`
        bg-white rounded-xl border-2 p-4 w-80 cursor-pointer transition-all
        ${isSelected ? 'border-pink-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 uppercase font-medium mb-1">Trigger</div>
          <div className="font-medium text-gray-900 text-sm">{triggerInfo?.label || trigger.type}</div>
          <p className="text-xs text-gray-500 mt-1">{triggerInfo?.description}</p>
        </div>
      </div>
    </div>
  );
}

export default TriggerNode;
