// Table display configuration - mirrors editFields.ts pattern for table display

export interface DisplayColumnConfig {
  label: string;
  type: 'text' | 'multiLine' | 'badge' | 'years' | 'rating' | 'dateRange' | 'toggle' | 'toggleWithIcon' | 'actions' | 'editSections' | 'contentBlocks' | 'viewButton' | 'lockStatus' | 'orderControl';
  fields?: string[];
  width?: string;
  align?: 'left' | 'right' | 'center';
  colors?: Record<string, { bg: string; text: string }>;
  trueLabel?: string;
  falseLabel?: string;
  trueColor?: string;
  falseColor?: string;
  actions?: string[];
  icon?: boolean;
  buttonText?: string;  // For viewButton type
  maxLength?: number;  // For multiLine type - truncate secondary fields to this length
}

export interface DisplayTableConfig {
  [key: string]: DisplayColumnConfig;
}

// Professionals table display configuration
export const professionalsDisplayConfig: DisplayTableConfig = {
  name: {
    label: 'Name',
    type: 'multiLine',
    fields: ['name', 'title'],
    width: '200px'
  },
  specialty: {
    label: 'Specialty',
    type: 'text',
    width: '150px'
  },
  location: {
    label: 'Location',
    type: 'text',
    width: '150px'
  },
  order: {
    label: 'Order',
    type: 'orderControl',
    width: '180px'
  },
  featured: {
    label: 'Featured',
    type: 'toggle',
    trueLabel: 'Featured',
    falseLabel: 'Not Featured',
    trueColor: 'bg-yellow-100 text-yellow-800',
    falseColor: 'bg-gray-100 text-gray-800',
    width: '120px'
  },
  actions: {
    label: '',
    type: 'actions',
    actions: ['edit', 'delete'],
    width: '100px',
    align: 'right'
  }
};

// Promos table display configuration
export const promosDisplayConfig: DisplayTableConfig = {
  name: {
    label: 'Title',
    type: 'multiLine',
    fields: ['title', 'subtitle'],
    width: '200px'
  },
  category: {
    label: 'Category',
    type: 'text',
    width: '150px'
  },
  status: {
    label: 'Status',
    type: 'badge',
    colors: {
      'Active': { bg: 'bg-green-100', text: 'text-green-800' },
      'Expired': { bg: 'bg-red-100', text: 'text-red-800' },
      'Scheduled': { bg: 'bg-blue-100', text: 'text-blue-800' }
    },
    width: '100px'
  },
  dates: {
    label: 'Dates',
    type: 'dateRange',
    fields: ['startDate', 'endDate'],
    width: '180px'
  },
  featured: {
    label: 'Featured',
    type: 'toggle',
    trueLabel: 'Featured',
    falseLabel: 'Not Featured',
    trueColor: 'bg-yellow-100 text-yellow-800',
    falseColor: 'bg-gray-100 text-gray-800',
    width: '100px'
  },
  visible: {
    label: 'Visible',
    type: 'toggleWithIcon',
    trueLabel: 'Visible',
    falseLabel: 'Hidden',
    trueColor: 'bg-green-100 text-green-800',
    falseColor: 'bg-red-100 text-red-800',
    icon: true,
    width: '100px'
  },
  actions: {
    label: '',
    type: 'actions',
    actions: ['edit', 'delete'],
    width: '100px',
    align: 'right'
  }
};

// Magazine Issues table display configuration
export const magazineDisplayConfig: DisplayTableConfig = {
  id: {
    label: 'Issue ID',
    type: 'text',
    width: '120px'
  },
  title: {
    label: 'Title',
    type: 'text',
    width: '200px'
  },
  issueNumber: {
    label: 'Issue #',
    type: 'text',
    width: '80px'
  },
  issueDate: {
    label: 'Date',
    type: 'text',
    width: '120px'
  },
  sectionCount: {
    label: 'Sections',
    type: 'editSections',
    width: '150px'
  },
  digitalView: {
    label: 'Digital',
    type: 'viewButton',
    buttonText: 'View Digital',
    width: '130px'
  },
  actions: {
    label: '',
    type: 'actions',
    actions: ['edit', 'delete'],
    width: '120px',
    align: 'right'
  }
};

// Magazine Sections table display configuration
export const sectionsDisplayConfig: DisplayTableConfig = {
  title: {
    label: 'Title',
    type: 'text',
    width: '200px'
  },
  subtitle: {
    label: 'Subtitle',
    type: 'text',
    width: '200px'
  },
  lockStatus: {
    label: 'Status',
    type: 'lockStatus',
    width: '200px'
  },
  actions: {
    label: '',
    type: 'actions',
    actions: ['edit', 'delete'],
    width: '100px',
    align: 'right'
  },
  contentBlocks: {
    label: 'Content Blocks',
    type: 'contentBlocks',
    width: '200px'
  },
  id: {
    label: 'Section ID',
    type: 'text',
    width: '150px'
  }
};

// =============================================================================
// GET FEATURED TABLE CONFIGURATIONS
// =============================================================================

// Get Featured Submissions table display configuration
export const submissionsDisplayConfig: DisplayTableConfig = {
  applicant: {
    label: 'Applicant',
    type: 'multiLine',
    fields: ['fullName', 'email'],
    width: '200px'
  },
  formType: {
    label: 'Form Type',
    type: 'badge',
    colors: {
      'cover': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'local-spotlight': { bg: 'bg-teal-100', text: 'text-teal-800' },
      'rising-star': { bg: 'bg-indigo-100', text: 'text-indigo-800' },
      'top-treatment': { bg: 'bg-pink-100', text: 'text-pink-800' },
      'profile-only': { bg: 'bg-gray-100', text: 'text-gray-800' }
    },
    width: '140px'
  },
  status: {
    label: 'Status',
    type: 'badge',
    colors: {
      'pending_review': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'approved': { bg: 'bg-green-100', text: 'text-green-800' },
      'rejected': { bg: 'bg-red-100', text: 'text-red-800' }
    },
    width: '120px'
  },
  submittedAtFormatted: {
    label: 'Submitted',
    type: 'text',
    width: '180px'
  },
  actions: {
    label: '',
    type: 'actions',
    actions: ['view', 'delete'],
    width: '100px',
    align: 'right'
  }
};

// Get Featured Form Configs table display configuration
export const formConfigsDisplayConfig: DisplayTableConfig = {
  id: {
    label: 'Form ID',
    type: 'text',
    width: '140px'
  },
  title: {
    label: 'Title',
    type: 'text',
    width: '200px'
  },
  fieldCount: {
    label: 'Fields',
    type: 'text',
    width: '80px'
  },
  sectionCount: {
    label: 'Sections',
    type: 'text',
    width: '90px'
  },
  enabled: {
    label: 'Enabled',
    type: 'toggleWithIcon',
    trueLabel: 'Active',
    falseLabel: 'Disabled',
    trueColor: 'bg-green-100 text-green-800',
    falseColor: 'bg-gray-100 text-gray-600',
    icon: true,
    width: '100px'
  },
  order: {
    label: 'Order',
    type: 'text',
    width: '70px'
  },
  actions: {
    label: '',
    type: 'actions',
    actions: ['edit', 'delete'],
    width: '100px',
    align: 'right'
  }
};

// Digital Pages table display configuration
export const digitalPagesDisplayConfig: DisplayTableConfig = {
  pageNumber: {
    label: 'Page #',
    type: 'text',
    width: '80px'
  },
  id: {
    label: 'ID',
    type: 'text',
    width: '140px'
  },
  pageType: {
    label: 'Type',
    type: 'badge',
    colors: {
      'image-with-caption': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'full-page-image': { bg: 'bg-green-100', text: 'text-green-800' },
      'image-with-title': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'article-start-hero': { bg: 'bg-orange-100', text: 'text-orange-800' },
      'two-column': { bg: 'bg-teal-100', text: 'text-teal-800' },
      'gallery-grid': { bg: 'bg-pink-100', text: 'text-pink-800' }
    },
    width: '180px'
  },
  canvasName: {
    label: 'Canvas Name',
    type: 'text',
    width: '200px'
  },
  canvasStatus: {
    label: 'Canvas',
    type: 'badge',
    colors: {
      'Generated': { bg: 'bg-green-100', text: 'text-green-800' },
      'Not Generated': { bg: 'bg-gray-100', text: 'text-gray-600' }
    },
    width: '130px'
  },
  actions: {
    label: '',
    type: 'actions',
    actions: ['moveUp', 'moveDown', 'edit', 'delete'],
    width: '150px',
    align: 'right'
  }
};

// =============================================================================
// UNIFIED FORM CONFIGURATIONS
// =============================================================================

// Unified Form Configs table display configuration (all categories)
export const unifiedFormConfigsDisplayConfig: DisplayTableConfig = {
  title: {
    label: 'Form',
    type: 'multiLine',
    fields: ['title', 'description'],
    width: '300px',
    maxLength: 80
  },
  categoryLabel: {
    label: 'Category',
    type: 'badge',
    colors: {
      'Get Featured': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'Digital Card': { bg: 'bg-teal-100', text: 'text-teal-800' }
    },
    width: '140px'
  },
  sectionCount: {
    label: 'Sections',
    type: 'text',
    width: '100px'
  },
  fieldCount: {
    label: 'Fields',
    type: 'text',
    width: '100px'
  },
  enabled: {
    label: 'Status',
    type: 'toggleWithIcon',
    trueLabel: 'Enabled',
    falseLabel: 'Disabled',
    trueColor: 'bg-green-100 text-green-800',
    falseColor: 'bg-gray-100 text-gray-500',
    icon: true,
    width: '120px'
  },
  actions: {
    label: '',
    type: 'actions',
    actions: ['edit', 'delete'],
    width: '120px',
    align: 'right'
  }
};

// =============================================================================
// PROFESSIONAL SUBMISSIONS (DIGITAL CARD APPLICATIONS)
// =============================================================================

// Email Templates table display configuration
export const emailsDisplayConfig: DisplayTableConfig = {
  name: {
    label: 'Template Name',
    type: 'text',
    width: '200px'
  },
  category: {
    label: 'Category',
    type: 'badge',
    width: '120px',
    colors: {
      'newsletter': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'marketing': { bg: 'bg-green-100', text: 'text-green-800' },
      'transactional': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'regular': { bg: 'bg-gray-100', text: 'text-gray-800' }
    }
  },
  templateType: {
    label: 'Type',
    type: 'badge',
    width: '130px',
    colors: {
      'section-based': { bg: 'bg-indigo-100', text: 'text-indigo-800' },
      'regular': { bg: 'bg-amber-100', text: 'text-amber-800' }
    }
  },
  description: {
    label: 'Description',
    type: 'multiLine',
    fields: ['description'],
    width: '300px',
    maxLength: 80
  },
  actions: {
    label: '',
    type: 'actions',
    actions: ['view'],
    width: '100px',
    align: 'right'
  }
};

// Professional Submissions table display configuration
export const professionalSubmissionsDisplayConfig: DisplayTableConfig = {
  applicant: {
    label: 'Applicant',
    type: 'multiLine',
    fields: ['name', 'email'],
    width: '200px'
  },
  specialty: {
    label: 'Specialty',
    type: 'text',
    width: '140px'
  },
  status: {
    label: 'Status',
    type: 'badge',
    colors: {
      'pending_review': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'approved': { bg: 'bg-green-100', text: 'text-green-800' },
      'rejected': { bg: 'bg-red-100', text: 'text-red-800' }
    },
    width: '120px'
  },
  submittedAtFormatted: {
    label: 'Submitted',
    type: 'text',
    width: '140px'
  },
  actions: {
    label: '',
    type: 'actions',
    actions: ['view', 'addProfessional', 'delete'],
    width: '180px',
    align: 'right'
  }
};