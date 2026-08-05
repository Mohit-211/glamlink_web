"use client";

import React from "react";
import { FieldErrors, GlamCardFormData } from "./types"; // adjust path
import BasicInformationSection from "./LocationsSection/BasicInformationSection";
import LocationsSection from "./LocationsSection/LocationsSection";
import BusinessHoursSection from "./LocationsSection/BusinessHoursSection";



interface Props {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
  errors?: FieldErrors;
  clearError?: (key: string) => void;
}

const BasicInfoForm: React.FC<Props> = ({ data, setData, errors, clearError }) => {
  if (!data) return null;

  return (
    <div className="space-y-10">
      <BasicInformationSection
        data={data}
        setData={setData}
        errors={errors}
        clearError={clearError}
      />

      <LocationsSection
        data={data}
        setData={setData}
        errors={errors}
        clearError={clearError}
      />

      <BusinessHoursSection data={data} setData={setData} />
    </div>
  );
};

export default BasicInfoForm;