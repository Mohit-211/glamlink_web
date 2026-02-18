/**
 * WorkflowPreview Component
 *
 * Read-only horizontal view of automation workflow
 */

'use client';

import {
  AutomationTrigger,
  AutomationCondition,
  AutomationAction
} from '@/lib/features/crm/marketing/types';
import { TriggerNode } from './TriggerNode';
import { ConditionNode } from './ConditionNode';
import { ActionNode } from './ActionNode';

interface WorkflowPreviewProps {
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
}

export function WorkflowPreview({ trigger, conditions, actions }: WorkflowPreviewProps) {
  return (
    <div className="workflow-preview p-4 overflow-x-auto">
      <div className="flex items-center space-x-4 min-w-max">
        {/* Trigger */}
        <TriggerNode
          trigger={trigger}
          onChange={() => {}}
          readOnly
        />

        {/* Arrow */}
        <ArrowConnector />

        {/* Conditions */}
        {conditions.map((condition, index) => (
          <div key={condition.id} className="flex items-center">
            <ConditionNode
              condition={condition}
              onChange={() => {}}
              onDelete={() => {}}
              readOnly
            />
            <ArrowConnector />
          </div>
        ))}

        {/* Actions */}
        {actions.map((action, index) => (
          <div key={action.id} className="flex items-center">
            <ActionNode
              action={action}
              onChange={() => {}}
              onDelete={() => {}}
              readOnly
            />
            {index < actions.length - 1 && <ArrowConnector />}
          </div>
        ))}
      </div>
    </div>
  );
}

function ArrowConnector() {
  return (
    <div className="flex items-center px-2">
      <div className="w-8 h-0.5 bg-gray-300" />
      <svg className="w-4 h-4 text-gray-400 -ml-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  );
}

export default WorkflowPreview;
