"use client";

interface RadioOption {
  id: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  helperText?: string;
}

export default function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  helperText
}: RadioGroupProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="space-y-3">
        {options.map((option) => (
          <div
            key={option.id}
            className="relative flex items-start"
          >
            <div className="flex items-center h-5">
              <input
                id={option.id}
                name={name}
                type="radio"
                value={option.id}
                checked={value === option.id}
                onChange={(e) => onChange(e.target.value)}
                className="h-4 w-4 border-gray-300 text-glamlink-teal focus:ring-glamlink-teal"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor={option.id}
                className="font-medium text-gray-700 cursor-pointer"
              >
                {option.label}
              </label>
              {option.description && (
                <p className="text-gray-500">{option.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}