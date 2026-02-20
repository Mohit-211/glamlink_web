/**
 * WorkflowBuilder Component
 *
 * Visual workflow builder for creating and editing automations
 */

'use client';

import { useState, useCallback } from 'react';
import {
  Automation,
  AutomationTrigger,
  AutomationCondition,
  AutomationAction
} from '@/lib/features/crm/marketing/types';
import { TriggerNode } from './TriggerNode';
import { ConditionNode } from './ConditionNode';
import { ActionNode } from './ActionNode';
import { AddNodeButton } from './AddNodeButton';

interface WorkflowBuilderProps {
  automation: Automation;
  onChange: (updates: Partial<Automation>) => void;
  readOnly?: boolean;
}

export function WorkflowBuilder({ automation, onChange, readOnly = false }: WorkflowBuilderProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleTriggerChange = (trigger: AutomationTrigger) => {
    onChange({ trigger });
  };

  const handleConditionChange = (conditionId: string, updates: Partial<AutomationCondition>) => {
    const updatedConditions = automation.conditions.map(c =>
      c.id === conditionId ? { ...c, ...updates } : c
    );
    onChange({ conditions: updatedConditions });
  };

  const handleActionChange = (actionId: string, updates: Partial<AutomationAction>) => {
    const updatedActions = automation.actions.map(a =>
      a.id === actionId ? { ...a, ...updates } : a
    );
    onChange({ actions: updatedActions });
  };

  const handleAddCondition = () => {
    const newCondition: AutomationCondition = {
      id: `condition_${Date.now()}`,
      field: '',
      operator: 'equals',
      value: '',
    };
    onChange({ conditions: [...automation.conditions, newCondition] });
  };

  const handleAddAction = (type: AutomationAction['type']) => {
    const newAction: AutomationAction = {
      id: `action_${Date.now()}`,
      type,
      config: getDefaultActionConfig(type),
    };
    onChange({ actions: [...automation.actions, newAction] });
  };

  const handleDeleteCondition = (conditionId: string) => {
    onChange({ conditions: automation.conditions.filter(c => c.id !== conditionId) });
  };

  const handleDeleteAction = (actionId: string) => {
    onChange({ actions: automation.actions.filter(a => a.id !== actionId) });
  };

  return (
    <div className="workflow-builder p-8 bg-gray-50 rounded-xl min-h-[400px]">
      {/* Workflow Canvas */}
      <div className="flex flex-col items-center space-y-4">
        {/* Trigger Node */}
        <TriggerNode
          trigger={automation.trigger}
          onChange={handleTriggerChange}
          readOnly={readOnly}
          isSelected={selectedNodeId === 'trigger'}
          onSelect={() => setSelectedNodeId('trigger')}
        />

        {/* Connector Line */}
        <div className="w-0.5 h-8 bg-gray-300" />

        {/* Conditions */}
        {automation.conditions.map((condition, index) => (
          <div key={condition.id} className="flex flex-col items-center">
            <ConditionNode
              condition={condition}
              onChange={(updates) => handleConditionChange(condition.id, updates)}
              onDelete={() => handleDeleteCondition(condition.id)}
              readOnly={readOnly}
              isSelected={selectedNodeId === condition.id}
              onSelect={() => setSelectedNodeId(condition.id)}
            />
            <div className="w-0.5 h-8 bg-gray-300" />
          </div>
        ))}

        {/* Actions */}
        {automation.actions.map((action, index) => (
          <div key={action.id} className="flex flex-col items-center">
            <ActionNode
              action={action}
              onChange={(updates) => handleActionChange(action.id, updates)}
              onDelete={() => handleDeleteAction(action.id)}
              readOnly={readOnly}
              isSelected={selectedNodeId === action.id}
              onSelect={() => setSelectedNodeId(action.id)}
            />
            {index < automation.actions.length - 1 && (
              <div className="w-0.5 h-8 bg-gray-300" />
            )}
          </div>
        ))}

        {/* Add Node Buttons */}
        {!readOnly && (
          <div className="flex items-center space-x-4 pt-4">
            <AddNodeButton
              label="Add condition"
              onClick={handleAddCondition}
              icon="⚡"
            />
            <AddNodeButton
              label="Add action"
              onClick={() => handleAddAction('send_email')}
              icon="📧"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function getDefaultActionConfig(type: AutomationAction['type']): Record<string, any> {
  switch (type) {
    case 'wait':
      return { duration: 4, unit: 'hours' };
    case 'send_email':
      return { templateId: '', subject: '', content: '' };
    case 'send_sms':
      return { message: '' };
    case 'add_tag':
      return { tag: '' };
    case 'remove_tag':
      return { tag: '' };
    case 'webhook':
      return { url: '', method: 'POST' };
    default:
      return {};
  }
}

export default WorkflowBuilder;
