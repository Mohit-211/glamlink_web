import { X, Plus, Hash } from "lucide-react";
import { useSpecialtiesField } from "./useSpecialtiesField";

interface FieldComponentProps {
  field: any;
  value: any;
  onChange: (fieldName: string, value: any) => void;
  error?: string;
  data?: any;
}

export default function SpecialtiesField({ field, value, onChange, error }: FieldComponentProps) {
  const {
    specialties,
    inputValue,
    setInputValue,
    handleRemoveSpecialty,
    handleInputSubmit,
    handleSuggestionClick,
    suggestions,
  } = useSpecialtiesField({
    value: value || [],
    fieldName: field.name,
    onChange,
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <p className="text-xs text-gray-500">Add multiple specialties to showcase your expertise</p>
      </div>

      {/* Input with suggestions */}
      <div className="relative">
        <form onSubmit={handleInputSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a specialty..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-glamlink-teal focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="px-4 py-2 bg-glamlink-teal text-white rounded-lg hover:bg-glamlink-teal-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        {/* Suggestions dropdown */}
        {inputValue && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-auto">
            {suggestions
              .filter(suggestion =>
                suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
                !specialties.includes(suggestion)
              )
              .map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg border-t border-gray-100"
                >
                  {suggestion}
                </button>
              ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Display current specialties */}
      {specialties.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-glamlink-teal/10 text-glamlink-teal rounded-full text-sm font-medium border border-glamlink-teal/20"
              >
                {specialty}
                <button
                  type="button"
                  onClick={() => handleRemoveSpecialty(index)}
                  className="text-glamlink-teal hover:text-glamlink-teal-dark"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            {specialties.length} {specialties.length === 1 ? 'specialty' : 'specialties'} added
          </p>
        </div>
      )}

      {/* Popular specialties */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Popular specialties:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.slice(0, 8).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={specialties.includes(suggestion)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                specialties.includes(suggestion)
                  ? 'border-glamlink-teal text-glamlink-teal bg-glamlink-teal/10'
                  : 'border-gray-200 text-gray-600 hover:border-glamlink-teal hover:text-glamlink-teal'
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
