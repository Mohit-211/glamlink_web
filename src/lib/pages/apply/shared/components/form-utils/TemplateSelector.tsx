"use client";

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { TemplateConfig } from '../../../featured/config/templates';

interface TemplateSelectorProps {
  templates: TemplateConfig[];
  selectedTemplate: TemplateConfig;
  onTemplateChange: (template: TemplateConfig) => void;
}

export default function TemplateSelector({
  templates,
  selectedTemplate,
  onTemplateChange
}: TemplateSelectorProps) {
  return (
    <div className="relative">
      <Listbox value={selectedTemplate} onChange={onTemplateChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-glamlink-teal sm:text-sm">
            <span className="flex items-center">
              <span className={`block truncate ${selectedTemplate.isAvailable ? 'text-gray-900' : 'text-gray-400'}`}>
                {selectedTemplate.name}
                {!selectedTemplate.isAvailable && (
                  <span className="ml-2 text-xs text-gray-400">(Coming Soon)</span>
                )}
              </span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 8l4 4 4-4"
                />
              </svg>
            </span>
          </Listbox.Button>

          <Transition
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {templates.map((template) => (
                <Listbox.Option
                  key={template.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-3 pr-9 ${
                      active ? 'bg-glamlink-teal text-white' : 'text-gray-900'
                    }`
                  }
                  value={template}
                  disabled={!template.isAvailable}
                >
                  {({ selected, active }) => (
                    <>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span
                            className={`block truncate ${
                              selected ? 'font-semibold' : 'font-normal'
                            } ${template.isAvailable ? '' : 'opacity-50'}`}
                          >
                            {template.name}
                            {!template.isAvailable && (
                              <span className="ml-2 text-xs">Coming Soon</span>
                            )}
                          </span>
                        </div>
                        {template.description && (
                          <span
                            className={`text-xs mt-1 ${
                              active ? 'text-white/70' : 'text-gray-500'
                            } ${template.isAvailable ? '' : 'opacity-50'}`}
                          >
                            {template.description}
                          </span>
                        )}
                      </div>

                      {selected && (
                        <span
                          className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                            active ? 'text-white' : 'text-glamlink-teal'
                          }`}
                        >
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}