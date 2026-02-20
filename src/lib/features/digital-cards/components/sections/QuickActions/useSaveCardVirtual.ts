"use client";

import { Professional } from "@/lib/pages/for-professionals/types/professional";

interface UseSaveCardVirtualReturn {
  createVCard: () => string;
  handleSaveToContacts: () => void;
}

export function useSaveCardVirtual(professional: Professional): UseSaveCardVirtualReturn {
  // Create vCard data for saving to contacts
  const createVCard = (): string => {
    const vcardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${professional.name}`,
      `ORG:${professional.business_name || professional.name}`,
      `TEL:${professional.phone || ''}`,
      `EMAIL:${professional.email || ''}`,
      `ADR:;;${professional.locationData?.address || ''};${professional.locationData?.city || ''};${professional.locationData?.state || ''};${professional.locationData?.zipCode || ''};;`,
      `URL:${professional.website || ''}`,
      `NOTE:${professional.bio || professional.description || ''}`,
      'END:VCARD'
    ].join('\n');

    return vcardData;
  };

  // Save to contacts functionality
  const handleSaveToContacts = (): void => {
    try {
      const vcardData = createVCard();
      const blob = new Blob([vcardData], { type: 'text/vcard' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${professional.name.replace(/\s+/g, '_')}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating vCard:', error);
      // Fallback: try to open with native sharing if available
      if (navigator.share) {
        navigator.share({
          title: professional.name,
          text: `${professional.name} - ${professional.specialty}`,
          url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
      }
    }
  };

  return {
    createVCard,
    handleSaveToContacts,
  };
}
