"use client";

import { useState, useEffect, useMemo } from "react";
import { Professional } from '@/lib/pages/for-professionals/types/professional';
import ProfessionalModal from './ProfessionalModal';
import { professionalEditFields, getProfessionalFieldsForModalType, getDefaultProfessionalValues } from "@/lib/pages/admin/config/fields";
import SimpleTable from "@/lib/pages/admin/components/shared/table/SimpleTable";
import { professionalsDisplayConfig } from "@/lib/pages/admin/config/displayTables";
import BatchUploadModal from "@/lib/pages/admin/components/shared/editing/modal/batch/BatchModal";
import TableHeader from "@/lib/pages/admin/components/shared/table/TableHeader";
import { useProfessionalsRedux } from './useProfessionalsRedux';
import { sampleProfessionalsData } from '@/lib/pages/admin/config/records/professionals';
import { getShortLocation, transformProfessionalsForDisplay } from './useProfessionals';

export default function ProfessionalsTab() {
  // Use Redux hook for data and operations
  const {
    professionals,
    lastUpdated,
    isLoading,
    error,
    isSaving,
    fetchProfessionals,
    createProfessional,
    updateProfessional,
    deleteProfessional,
    toggleFeatured,
    batchUpload,
    // Order management
    handleMoveUp,
    handleMoveDown,
    handleOrderChange
  } = useProfessionalsRedux();

  // UI state (modals)
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [showBatchUpload, setShowBatchUpload] = useState(false);

  // Modal type management (unique to professionals - UI concern)
  const [currentModalType, setCurrentModalType] = useState<string>('standard');
  const [filteredFields, setFilteredFields] = useState(professionalEditFields);

  // Transform professionals data to show shortened location in table
  const professionalsForDisplay = useMemo(() => {
    return transformProfessionalsForDisplay(professionals);
  }, [professionals]);

  // Modal type management useEffect
  useEffect(() => {
    if (showAddForm || editingProfessional) {
      const modalType = editingProfessional?.modalType || 'standard';
      setCurrentModalType(modalType);
      setFilteredFields(getProfessionalFieldsForModalType(modalType));
    }
  }, [showAddForm, editingProfessional]);

  // Handle modal type change
  const handleModalTypeChange = (fieldName: string, value: any) => {
    if (fieldName === 'modalType') {
      setCurrentModalType(value);
      setFilteredFields(getProfessionalFieldsForModalType(value));
    }
  };

  // Wrapper handlers for confirmations and modal closing
  const handleDeleteWithConfirm = async (professional: Professional) => {
    if (!confirm(`Are you sure you want to delete "${professional.name}"?`)) return;
    await deleteProfessional(professional.id);
  };

  const handleCreateWithClose = async (data: Professional) => {
    await createProfessional(data);
    setShowAddForm(false);
  };

  const handleUpdateWithClose = async (data: Professional) => {
    await updateProfessional(data);
    setEditingProfessional(null);
  };

  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <TableHeader
          title="Professionals Management"
          onRefresh={fetchProfessionals}
          isRefreshing={isLoading}
          onBatchUpload={() => setShowBatchUpload(true)}
          batchUploadText="Manage Batch"
          onAdd={() => setShowAddForm(true)}
          addButtonText="Add Professional"
          lastUpdated={lastUpdated}
        />

        <SimpleTable
          data={professionalsForDisplay}
          config={professionalsDisplayConfig}
          onEdit={(displayPro) => {
            // Find original professional with full location data
            const original = professionals.find(p => p.id === displayPro.id);
            if (original) setEditingProfessional(original);
          }}
          onDelete={(displayPro) => {
            // Find original professional for deletion
            const original = professionals.find(p => p.id === displayPro.id);
            if (original) handleDeleteWithConfirm(original);
          }}
          onToggleFeatured={(displayPro) => {
            const original = professionals.find(p => p.id === displayPro.id);
            if (original) toggleFeatured(original);
          }}
          onMoveUp={(displayPro) => {
            const original = professionals.find(p => p.id === displayPro.id);
            if (original) handleMoveUp(original);
          }}
          onMoveDown={(displayPro) => {
            const original = professionals.find(p => p.id === displayPro.id);
            if (original) handleMoveDown(original);
          }}
          onOrderChange={(displayPro, newPosition) => {
            const original = professionals.find(p => p.id === displayPro.id);
            if (original) handleOrderChange(original, newPosition);
          }}
          isLoading={isLoading}
        />
      </div>

      {/* Add/Edit Professional Modals */}
      <ProfessionalModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={handleCreateWithClose}
        title="Add New Professional"
        initialData={getDefaultProfessionalValues()}
        onFieldChange={handleModalTypeChange}
        isSaving={isSaving}
      />

      <ProfessionalModal
        isOpen={!!editingProfessional}
        onClose={() => setEditingProfessional(null)}
        onSave={handleUpdateWithClose}
        title="Edit Professional"
        initialData={editingProfessional!}
        onFieldChange={handleModalTypeChange}
        isSaving={isSaving}
      />

      {/* Batch Manage Modal */}
      <BatchUploadModal
        isOpen={showBatchUpload}
        onClose={() => setShowBatchUpload(false)}
        title="Manage Professionals Batch"
        itemTypeName="Professionals"
        sampleData={sampleProfessionalsData}
        onUpload={batchUpload}
        maxFileSize={5}
        currentData={professionals}
      />
    </div>
  );
}