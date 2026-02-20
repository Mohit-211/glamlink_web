import React from 'react';
import { ButtonConfig, FeatureItem, TestimonialItem } from '@/lib/config/pageContent';
import { ImageUploadField } from './ImageUploadField';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextField({ label, value, onChange, placeholder }: TextFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-glamlink-teal"
      />
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}

export function TextAreaField({ label, value, onChange, rows = 3, placeholder }: TextAreaFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-glamlink-teal"
      />
    </div>
  );
}

interface ButtonArrayFieldProps {
  buttons: ButtonConfig[];
  onChange: (buttons: ButtonConfig[]) => void;
}

export function ButtonArrayField({ buttons, onChange }: ButtonArrayFieldProps) {
  const updateButton = (index: number, field: keyof ButtonConfig, value: any) => {
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    onChange(newButtons);
  };

  const removeButton = (index: number) => {
    onChange(buttons.filter((_, i) => i !== index));
  };

  const addButton = () => {
    onChange([...buttons, { text: '', action: '', style: 'primary' }]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Buttons</label>
        <button
          type="button"
          onClick={addButton}
          className="text-sm text-glamlink-teal hover:text-glamlink-teal-dark"
        >
          + Add Button
        </button>
      </div>
      {buttons.map((button, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Button {index + 1}</span>
            <button
              type="button"
              onClick={() => removeButton(index)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Text</label>
              <input
                type="text"
                value={button.text}
                onChange={(e) => updateButton(index, 'text', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-glamlink-teal"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Action</label>
              <input
                type="text"
                value={button.action}
                onChange={(e) => updateButton(index, 'action', e.target.value)}
                placeholder="e.g., download-client"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-glamlink-teal"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Style</label>
            <select
              value={button.style || 'primary'}
              onChange={(e) => updateButton(index, 'style', e.target.value as 'primary' | 'secondary')}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-glamlink-teal"
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

interface FeatureArrayFieldProps {
  features: FeatureItem[];
  onChange: (features: FeatureItem[]) => void;
}

export function FeatureArrayField({ features, onChange }: FeatureArrayFieldProps) {
  const updateFeature = (index: number, field: keyof FeatureItem, value: any) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    onChange(newFeatures);
  };

  const removeFeature = (index: number) => {
    onChange(features.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    onChange([...features, { title: '', description: '', icon: '' }]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Features</label>
        <button
          type="button"
          onClick={addFeature}
          className="text-sm text-glamlink-teal hover:text-glamlink-teal-dark"
        >
          + Add Feature
        </button>
      </div>
      {features.map((feature, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Feature {index + 1}</span>
            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          <TextField
            label="Title"
            value={feature.title}
            onChange={(value) => updateFeature(index, 'title', value)}
          />
          <TextAreaField
            label="Description"
            value={feature.description}
            onChange={(value) => updateFeature(index, 'description', value)}
            rows={2}
          />
          <TextField
            label="Icon (emoji or icon name)"
            value={feature.icon || ''}
            onChange={(value) => updateFeature(index, 'icon', value)}
            placeholder="e.g., 🌟 or PersonOutline"
          />
        </div>
      ))}
    </div>
  );
}

interface ServiceArrayFieldProps {
  services: Array<{ title: string; image: string; alt: string }>;
  onChange: (services: Array<{ title: string; image: string; alt: string }>) => void;
}

export function ServiceArrayField({ services, onChange }: ServiceArrayFieldProps) {
  const updateService = (index: number, field: string, value: string) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], [field]: value };
    onChange(newServices);
  };

  const removeService = (index: number) => {
    onChange(services.filter((_, i) => i !== index));
  };

  const addService = () => {
    onChange([...services, { title: '', image: '', alt: '' }]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Services</label>
        <button
          type="button"
          onClick={addService}
          className="text-sm text-glamlink-teal hover:text-glamlink-teal-dark"
        >
          + Add Service
        </button>
      </div>
      {services.map((service, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Service {index + 1}</span>
            <button
              type="button"
              onClick={() => removeService(index)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          <TextField
            label="Title"
            value={service.title}
            onChange={(value) => updateService(index, 'title', value)}
          />
          <ImageUploadField
            label="Image"
            value={service.image}
            onChange={(value) => updateService(index, 'image', value)}
            placeholder="/images/service.png"
          />
          <TextField
            label="Alt Text"
            value={service.alt}
            onChange={(value) => updateService(index, 'alt', value)}
            placeholder="Description of image"
          />
        </div>
      ))}
    </div>
  );
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
      >
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <svg
          className={`w-5 h-5 text-gray-600 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-6 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}