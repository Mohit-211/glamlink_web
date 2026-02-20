"use client";

import { useState } from "react";
import { PromoItem } from "@/lib/features/promos/config";
import PromoModal from "@/lib/pages/admin/components/promos/PromoModal";
import { getDefaultPromoValues } from "@/lib/pages/admin/config/fields";
import SimpleTable from "@/lib/pages/admin/components/shared/table/SimpleTable";
import { promosDisplayConfig } from "@/lib/pages/admin/config/displayTables";
import BatchUploadModal from "@/lib/pages/admin/components/shared/editing/modal/batch/BatchModal";
import TableHeader, { DateFilterState } from "@/lib/pages/admin/components/shared/table/TableHeader";
import { usePromosRedux } from './usePromosRedux';
import { samplePromosData } from '@/lib/pages/admin/config/records/promos';

export default function PromosTab() {
  // Use Redux hook for data and operations
  const {
    promos,
    lastUpdated,
    isLoading,
    error,
    isSaving,
    fetchPromos,
    createPromo,
    updatePromo,
    deletePromo,
    toggleFeatured,
    toggleVisibility,
    batchUpload
  } = usePromosRedux();

  // UI state (modals)
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoItem | null>(null);
  const [showBatchUpload, setShowBatchUpload] = useState(false);

  // Date filter state - default to showing all
  const [dateFilter, setDateFilter] = useState<DateFilterState>({
    option: 'all',
    startDate: undefined,
    endDate: undefined
  });

  // Calculate date range based on filter option
  const getDateRange = () => {
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (dateFilter.option === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      endDate = now;
    } else if (dateFilter.option === 'month') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      endDate = now;
    } else if (dateFilter.option === 'custom') {
      startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
      endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;
    }

    return { startDate, endDate };
  };

  // Filter promos based on endDate
  const filteredPromos = promos.filter(promo => {
    // Date filter
    if (dateFilter.option !== 'all' && promo.endDate) {
      const { startDate, endDate } = getDateRange();
      const promoEndDate = new Date(promo.endDate);

      if (startDate && promoEndDate < startDate) {
        return false;
      }
      if (endDate && promoEndDate > endDate) {
        return false;
      }
    }

    return true;
  });

  // Wrapper handlers for confirmations and modal closing
  const handleDeleteWithConfirm = async (promo: PromoItem) => {
    if (!confirm(`Are you sure you want to delete "${promo.title}"?`)) return;
    await deletePromo(promo.id);
  };

  const handleCreateWithClose = async (data: PromoItem) => {
    await createPromo(data);
    setShowAddForm(false);
  };

  const handleUpdateWithClose = async (data: PromoItem) => {
    await updatePromo(data);
    setEditingPromo(null);
  };



  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <TableHeader
          title="Promos Management"
          onRefresh={fetchPromos}
          isRefreshing={isLoading}
          onBatchUpload={() => setShowBatchUpload(true)}
          batchUploadText="Manage Batch"
          onAdd={() => setShowAddForm(true)}
          addButtonText="Add Promo"
          lastUpdated={lastUpdated}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          dateFilterLabel="End Date"
        />

        <SimpleTable
          data={filteredPromos}
          config={promosDisplayConfig}
          onEdit={(promo) => setEditingPromo(promo)}
          onDelete={handleDeleteWithConfirm}
          onToggleFeatured={toggleFeatured}
          onToggleVisibility={toggleVisibility}
          isLoading={isLoading}
        />
      </div>

      {/* Add/Edit Promo Modals */}
      <PromoModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={handleCreateWithClose}
        title="Create New Promo"
        initialData={getDefaultPromoValues()}
      />

      <PromoModal
        isOpen={!!editingPromo}
        onClose={() => setEditingPromo(null)}
        onSave={handleUpdateWithClose}
        title="Edit Promo"
        initialData={editingPromo!}
      />

      {/* Batch Upload Modal */}
      <BatchUploadModal
        isOpen={showBatchUpload}
        onClose={() => setShowBatchUpload(false)}
        title="Manage Promos Batch"
        itemTypeName="Promos"
        sampleData={samplePromosData}
        onUpload={batchUpload}
        maxFileSize={5}
        currentData={promos}
      />
    </div>
  );
}
