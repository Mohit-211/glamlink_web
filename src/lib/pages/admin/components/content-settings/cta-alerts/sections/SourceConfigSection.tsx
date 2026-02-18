'use client';

import { CTAAlertConfig } from '@/lib/pages/admin/types/ctaAlert';
import { PromoItem } from '@/lib/features/promos/config';

const inputClassName = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-glamlink-teal focus:border-glamlink-teal";

interface SourceConfigSectionProps {
  localConfig: Partial<CTAAlertConfig>;
  activePromos: PromoItem[];
  updateField: (field: keyof CTAAlertConfig, value: any) => void;
  handlePromoSelect: (promoId: string) => void;
}

export default function SourceConfigSection({
  localConfig,
  activePromos,
  updateField,
  handlePromoSelect,
}: SourceConfigSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Source Configuration</h3>

      {/* Source Type Radio */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Source Type</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="sourceType"
              value="standalone"
              checked={localConfig.sourceType === 'standalone'}
              onChange={(e) => updateField('sourceType', e.target.value)}
              className="h-4 w-4 text-glamlink-teal border-gray-300 focus:ring-glamlink-teal"
            />
            <span className="ml-2 text-sm text-gray-700">Standalone CTA</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="sourceType"
              value="promo"
              checked={localConfig.sourceType === 'promo'}
              onChange={(e) => updateField('sourceType', e.target.value)}
              className="h-4 w-4 text-glamlink-teal border-gray-300 focus:ring-glamlink-teal"
            />
            <span className="ml-2 text-sm text-gray-700">Link to Existing Promo</span>
          </label>
        </div>
      </div>

      {/* Promo Selector (shown when source type is promo) */}
      {localConfig.sourceType === 'promo' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Promo <span className="text-red-500">*</span>
          </label>
          <select
            value={localConfig.linkedPromoId || ''}
            onChange={(e) => handlePromoSelect(e.target.value)}
            className={inputClassName}
          >
            <option value="">-- Select a promo --</option>
            {activePromos.map(promo => (
              <option key={promo.id} value={promo.id}>
                {promo.title} (ends {promo.endDate})
              </option>
            ))}
          </select>
          {activePromos.length === 0 && (
            <p className="mt-2 text-sm text-amber-600">
              No active promos available. Create a promo first or use standalone mode.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
