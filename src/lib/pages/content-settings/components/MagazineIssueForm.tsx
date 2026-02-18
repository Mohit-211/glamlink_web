"use client";

import { useState } from "react";
import { MagazineIssueCard } from "@/lib/pages/magazine/types/magazine";
import { MagazineIssueFormProps } from "../types";

export default function MagazineIssueForm({ issue, onSave, onCancel, isSaving }: MagazineIssueFormProps) {
  const [formData, setFormData] = useState<MagazineIssueCard>(
    issue || {
      id: "",
      title: "",
      subtitle: "",
      issueNumber: 1,
      issueDate: new Date().toISOString().split("T")[0],
      coverImage: "/images/founders_badge.JPG",
      coverImageAlt: "",
      description: "",
      featured: false,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id) {
      alert("Please enter an Issue ID");
      return;
    }

    if (!formData.title) {
      alert("Please enter a title");
      return;
    }

    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Issue ID (e.g., 2025-08-25)</label>
        <input type="text" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-glamlink-teal" placeholder="YYYY-MM-DD" disabled={!!issue} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Number</label>
        <input type="number" value={formData.issueNumber} onChange={(e) => setFormData({ ...formData, issueNumber: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-glamlink-teal" min="1" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-glamlink-teal" placeholder="Summer Glow Edition" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
        <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-glamlink-teal" placeholder="Your Guide to Radiant Summer Beauty" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-glamlink-teal" rows={3} placeholder="Brief description of the issue content..." />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
        <input type="date" value={formData.issueDate} onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-glamlink-teal" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
        <input type="text" value={formData.coverImage} onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-glamlink-teal" placeholder="/images/founders_badge.JPG" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image Alt Text</label>
        <input type="text" value={formData.coverImageAlt} onChange={(e) => setFormData({ ...formData, coverImageAlt: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-glamlink-teal" placeholder="Description of cover image" />
      </div>

      <div className="flex items-center">
        <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="h-4 w-4 text-glamlink-teal focus:ring-glamlink-teal border-gray-300 rounded" />
        <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
          Featured Issue
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isSaving} className="px-4 py-2 bg-glamlink-teal text-white font-semibold rounded-md hover:bg-glamlink-teal-dark transition-colors disabled:opacity-50">
          {isSaving ? "Saving..." : "Save Issue"}
        </button>
      </div>
    </form>
  );
}
