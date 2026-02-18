'use client';

import { useState, useMemo } from 'react';
import TableHeader from '../shared/table/TableHeader';
import SimpleTable from '../shared/table/SimpleTable';
import EmailPreviewModal from './EmailPreviewModal';
import { SECTION_BASED_EMAILS, REGULAR_TEMPLATES } from '@/lib/emails/config';
import { emailsDisplayConfig } from '@/lib/pages/admin/config/displayTables';

// Unified template type for both section-based and regular templates
export interface UnifiedTemplate {
  id: string;
  name: string;
  description: string;
  category: 'newsletter' | 'marketing' | 'transactional' | 'regular';
  templateType: 'section-based' | 'regular';
  dataFile?: string;
  component?: string;
}

export default function EmailsTab() {
  const [selectedTemplate, setSelectedTemplate] = useState<UnifiedTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Combine both template types into unified list
  const templates = useMemo<UnifiedTemplate[]>(() => {
    const sectionBased: UnifiedTemplate[] = SECTION_BASED_EMAILS.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
      templateType: 'section-based' as const,
      dataFile: t.dataFile
    }));

    const regular: UnifiedTemplate[] = REGULAR_TEMPLATES.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: 'regular' as const,
      templateType: 'regular' as const,
      component: t.component
    }));

    return [...sectionBased, ...regular];
  }, []);

  const handlePreview = (template: UnifiedTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <TableHeader
          title="Email Templates"
        />

        <SimpleTable
          data={templates}
          config={emailsDisplayConfig}
          onView={handlePreview}
          isLoading={false}
        />
      </div>

      <EmailPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        template={selectedTemplate}
      />
    </div>
  );
}
