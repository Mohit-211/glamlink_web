/**
 * Marketing Automation Types
 *
 * Types for the marketing automation system including triggers, conditions, actions, and workflows
 */

/**
 * Automation Status
 */
export type AutomationStatus = 'active' | 'inactive' | 'draft';

/**
 * Automation Trigger Types
 */
export type AutomationTriggerType =
  | 'abandoned_checkout'
  | 'abandoned_cart'
  | 'abandoned_browse'
  | 'new_subscriber'
  | 'post_purchase'
  | 'customer_birthday'
  | 'customer_win_back'
  | 'product_back_in_stock';

/**
 * Automation Trigger
 */
export interface AutomationTrigger {
  type: AutomationTriggerType;
  config: Record<string, any>;
}

/**
 * Condition Operators
 */
export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'less_than'
  | 'is_empty'
  | 'is_not_empty';

/**
 * Automation Condition
 */
export interface AutomationCondition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: any;
}

/**
 * Automation Action Types
 */
export type AutomationActionType =
  | 'wait'
  | 'send_email'
  | 'send_sms'
  | 'add_tag'
  | 'remove_tag'
  | 'webhook';

/**
 * Automation Action
 */
export interface AutomationAction {
  id: string;
  type: AutomationActionType;
  config: Record<string, any>;
}

/**
 * Automation Metrics
 */
export interface AutomationMetrics {
  triggered: number;
  completed: number;
  inProgress: number;
  failed: number;
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;
  conversions: number;
  revenue: number;
}

/**
 * Automation
 */
export interface Automation {
  id: string;
  brandId: string;
  name: string;
  description: string;
  status: AutomationStatus;
  templateId?: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  metrics: AutomationMetrics;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

/**
 * Automation Template
 */
export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  requiredApps: string[];
  createdBy: 'system' | 'user';
}

/**
 * Automation Stats (for dashboard)
 */
export interface AutomationStats {
  reach: number;
  sessions: number;
  orders: number;
  conversionRate: number;
  sales: number;
  averageOrderValue: number;
}

/**
 * Create Automation Input
 */
export interface CreateAutomationInput {
  name: string;
  description: string;
  status: AutomationStatus;
  brandId: string;
  templateId?: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  metrics: AutomationMetrics;
}
