/**
 * Magazines Display Configuration
 */

import type { DisplayTableConfig } from '@/lib/pages/admin/types';

export const magazinesDisplayConfig: DisplayTableConfig = {
  title: {
    label: 'Issue Title',
    type: 'text',
    width: '200px',
  },
  issueNumber: {
    label: 'Issue #',
    type: 'text',
    width: '80px',
  },
  totalViews: {
    label: 'Views',
    type: 'text',
    width: '100px',
  },
  uniqueVisitors: {
    label: 'Unique Visitors',
    type: 'text',
    width: '120px',
  },
  totalPageViews: {
    label: 'Page Views',
    type: 'text',
    width: '100px',
  },
  actions: {
    label: '',
    type: 'actions',
    actions: ['view'],
    width: '80px',
    align: 'right',
  },
};
