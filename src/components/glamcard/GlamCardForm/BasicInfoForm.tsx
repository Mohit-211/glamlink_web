"use client";

import React from "react";
import { GlamCardFormData } from "./types"; // adjust path
import BasicInformationSection from "./LocationsSection/BasicInformationSection";
import LocationsSection from "./LocationsSection/LocationsSection";
import BusinessHoursSection from "./LocationsSection/BusinessHoursSection";



interface Props {
  data: GlamCardFormData;
  setData: React.Dispatch<React.SetStateAction<GlamCardFormData>>;
}

const BasicInfoForm: React.FC<Props> = ({ data, setData }) => {
  if (!data) return null;

  return (
    <div className="space-y-10">
      <BasicInformationSection data={data} setData={setData} />

      <LocationsSection data={data} setData={setData} />

      <BusinessHoursSection data={data} setData={setData} />
    </div>
  );
};

export default BasicInfoForm;