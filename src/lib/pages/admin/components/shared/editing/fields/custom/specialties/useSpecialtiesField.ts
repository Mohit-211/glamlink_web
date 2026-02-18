"use client";

import { useState, useCallback } from "react";

interface UseSpecialtiesFieldProps {
  value: string[];
  fieldName: string;
  onChange: (fieldName: string, value: string[]) => void;
}

export interface UseSpecialtiesFieldReturn {
  // State
  specialties: string[];
  inputValue: string;

  // Setters
  setInputValue: (value: string) => void;

  // Handlers
  handleAddSpecialty: (specialty: string) => void;
  handleRemoveSpecialty: (index: number) => void;
  handleInputSubmit: (e: React.FormEvent) => void;
  handleSuggestionClick: (suggestion: string) => void;

  // Constants
  suggestions: string[];
}

// Common specialties suggestions
const SPECIALTY_SUGGESTIONS = [
  "Balayage & Foilage",
  "Keratin Treatments",
  "Bridal & Event Styling",
  "Extension Applications",
  "Certified Colorist",
  "Facial Treatments",
  "Waxing Services",
  "Manicures & Pedicures",
  "Makeup Artistry",
  "Hair Extensions",
  "Scalp Treatments",
  "Haircut & Styling",
  "Chemical Peels",
  "Microblading",
  "Eyelash Extensions",
  "Massage Therapy",
  "Body Treatments",
  "Anti-Aging Treatments",
  "Acne Treatments",
  "Holistic Skincare"
];

export function useSpecialtiesField({
  value,
  fieldName,
  onChange,
}: UseSpecialtiesFieldProps): UseSpecialtiesFieldReturn {
  const [specialties, setSpecialties] = useState<string[]>(value || []);
  const [inputValue, setInputValue] = useState('');

  const handleAddSpecialty = useCallback((specialty: string) => {
    if (specialty && !specialties.includes(specialty)) {
      const updated = [...specialties, specialty];
      setSpecialties(updated);
      onChange(fieldName, updated);
      setInputValue('');
    }
  }, [specialties, fieldName, onChange]);

  const handleRemoveSpecialty = useCallback((index: number) => {
    const updated = specialties.filter((_, i) => i !== index);
    setSpecialties(updated);
    onChange(fieldName, updated);
  }, [specialties, fieldName, onChange]);

  const handleInputSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleAddSpecialty(inputValue.trim());
  }, [inputValue, handleAddSpecialty]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    handleAddSpecialty(suggestion);
  }, [handleAddSpecialty]);

  return {
    // State
    specialties,
    inputValue,

    // Setters
    setInputValue,

    // Handlers
    handleAddSpecialty,
    handleRemoveSpecialty,
    handleInputSubmit,
    handleSuggestionClick,

    // Constants
    suggestions: SPECIALTY_SUGGESTIONS,
  };
}
