/**
 * Digital Cards Display Configuration
 */

import type { DisplayTableConfig } from '@/lib/pages/admin/types';

export const digitalCardsDisplayConfig: DisplayTableConfig = {
  name: {
    label: 'Professional',
    type: 'text',
    width: '200px',
  },
  title: {
    label: 'Title',
    type: 'text',
    width: '150px',
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
  bookClicks: {
    label: 'Book Clicks',
    type: 'text',
    width: '100px',
  },
  totalClicks: {
    label: 'Total Clicks',
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
