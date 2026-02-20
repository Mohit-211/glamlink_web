"use client";

import React from "react";
import { Plus, Edit2, Trash2, Star } from "lucide-react";
import { FieldComponentProps } from "@/lib/pages/admin/types/forms";
import { usePromotionField, Promotion } from "./usePromotionField";

export default function PromotionField({ field, value, onChange, error }: FieldComponentProps) {
  const {
    promotions,
    showAddForm,
    editingId,
    formData,
    setShowAddForm,
    setFormData,
    handleAddPromotion,
    handleEdit,
    handleDelete,
    handleCancel,
  } = usePromotionField({
    value: value || [],
    fieldName: field.name,
    onChange,
  });

  return (
    <div className="space-y-4">
      {/* Field Label */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Promotions List */}
      {promotions.length > 0 && (
        <div className="space-y-3">
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className={`border rounded-lg p-4 ${
                promotion.isActive ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900">{promotion.title}</h3>
                    {promotion.isFeatured && (
                      <span className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                    )}
                    {!promotion.isActive && (
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>

                  {promotion.html && (
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">HTML:</span> {promotion.html.substring(0, 100)}{promotion.html.length > 100 ? '...' : ''}
                    </div>
                  )}

                  {promotion.value && (
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Value:</span> {promotion.value}
                    </div>
                  )}

                  {promotion.promoCode && (
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Code:</span> {promotion.promoCode}
                    </div>
                  )}

                  {promotion.startDate && promotion.endDate && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Dates:</span> {promotion.startDate} - {promotion.endDate}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(promotion)}
                    className="p-1 text-gray-400 hover:text-glamlink-teal transition-colors"
                    title="Edit promotion"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(promotion.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete promotion"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="border border-glamlink-teal rounded-lg p-6 bg-glamlink-teal bg-opacity-5">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingId ? 'Edit Promotion' : 'Add New Promotion'}
          </h3>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
                placeholder="Enter promotion title"
              />
            </div>

            {/* HTML Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HTML
              </label>
              <textarea
                value={formData.html || ''}
                onChange={(e) => setFormData({ ...formData, html: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glamlink-teal font-mono text-sm"
                placeholder="<p>Enter HTML content for the promotion...</p>"
              />
              <p className="text-xs text-gray-500 mt-1">
                When HTML is provided, it will be displayed as the main promotion content. Leave empty to use fallback display.
              </p>
            </div>

            {/* Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="text"
                value={formData.value || ''}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
                placeholder="e.g., 20% Off, $50 Value, Buy One Get One"
              />
            </div>

            {/* Promo Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promo Code
              </label>
              <input
                type="text"
                value={formData.promoCode || ''}
                onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
                placeholder="e.g., SAVE20"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glamlink-teal"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="h-4 w-4 text-glamlink-teal focus:ring-glamlink-teal border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Featured</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-glamlink-teal focus:ring-glamlink-teal border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleAddPromotion}
                disabled={!formData.title?.trim()}
                className="px-4 py-2 bg-glamlink-teal text-white rounded-lg hover:bg-glamlink-teal-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {editingId ? 'Update Promotion' : 'Add Promotion'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Promotion Button */}
      {!showAddForm && (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-glamlink-teal hover:bg-glamlink-teal hover:bg-opacity-5 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-glamlink-teal"
        >
          <Plus className="w-4 h-4" />
          Add Promotion
        </button>
      )}

      {/* Field Error */}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}

      {/* Field Helper Text */}
      {field.helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{field.helperText}</p>
      )}
    </div>
  );
}
