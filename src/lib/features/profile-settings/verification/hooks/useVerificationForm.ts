"use client";

/**
 * useVerificationForm - Form state management for business verification
 */

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/features/auth/useAuth";
import type {
  VerificationFormState,
  BusinessInfoFormData,
  OwnerIdentityFormData,
  BusinessDocsFormData,
  VerificationDocument,
  UseVerificationFormReturn,
  INITIAL_FORM_STATE,
} from "../types";
import { TOTAL_STEPS } from "../config";

export function useVerificationForm(): UseVerificationFormReturn {
  const { user } = useAuth();

  const [formState, setFormState] = useState<VerificationFormState>({
    currentStep: 1,
    businessInfo: {
      businessName: "",
      businessType: "salon",
      businessAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      yearsInBusiness: 0,
      website: "",
      socialMedia: "",
    },
    ownerIdentity: {
      ownerFullName: "",
      ownerIdFront: null,
      ownerIdBack: null,
    },
    businessDocs: {
      businessLicense: null,
      certifications: [],
      insurance: null,
      taxDocument: null,
    },
    agreedToTerms: false,
    isSubmitting: false,
    submitError: null,
  });

  // =========================================================================
  // NAVIGATION
  // =========================================================================

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setFormState((prev) => ({ ...prev, currentStep: step }));
    }
  }, []);

  const nextStep = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, TOTAL_STEPS),
    }));
  }, []);

  const prevStep = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  // =========================================================================
  // BUSINESS INFO (Step 1)
  // =========================================================================

  const updateBusinessInfo = useCallback(
    (data: Partial<BusinessInfoFormData>) => {
      setFormState((prev) => ({
        ...prev,
        businessInfo: { ...prev.businessInfo, ...data },
      }));
    },
    []
  );

  // =========================================================================
  // OWNER IDENTITY (Step 2)
  // =========================================================================

  const updateOwnerIdentity = useCallback(
    (data: Partial<OwnerIdentityFormData>) => {
      setFormState((prev) => ({
        ...prev,
        ownerIdentity: { ...prev.ownerIdentity, ...data },
      }));
    },
    []
  );

  // =========================================================================
  // BUSINESS DOCS (Step 3)
  // =========================================================================

  const updateBusinessDocs = useCallback(
    (data: Partial<BusinessDocsFormData>) => {
      setFormState((prev) => ({
        ...prev,
        businessDocs: { ...prev.businessDocs, ...data },
      }));
    },
    []
  );

  const addCertification = useCallback((doc: VerificationDocument) => {
    setFormState((prev) => ({
      ...prev,
      businessDocs: {
        ...prev.businessDocs,
        certifications: [...prev.businessDocs.certifications, doc],
      },
    }));
  }, []);

  const removeCertification = useCallback((docId: string) => {
    setFormState((prev) => ({
      ...prev,
      businessDocs: {
        ...prev.businessDocs,
        certifications: prev.businessDocs.certifications.filter(
          (cert) => cert.id !== docId
        ),
      },
    }));
  }, []);

  // =========================================================================
  // TERMS
  // =========================================================================

  const setAgreedToTerms = useCallback((agreed: boolean) => {
    setFormState((prev) => ({ ...prev, agreedToTerms: agreed }));
  }, []);

  // =========================================================================
  // VALIDATION
  // =========================================================================

  const isStep1Valid = useCallback((): boolean => {
    const { businessName, businessType, businessAddress, city, state, zipCode } =
      formState.businessInfo;
    return !!(
      businessName.trim() &&
      businessType &&
      businessAddress.trim() &&
      city.trim() &&
      state.trim() &&
      zipCode.trim()
    );
  }, [formState.businessInfo]);

  const isStep2Valid = useCallback((): boolean => {
    const { ownerFullName, ownerIdFront } = formState.ownerIdentity;
    return !!(ownerFullName.trim() && ownerIdFront);
  }, [formState.ownerIdentity]);

  const isStep3Valid = useCallback((): boolean => {
    const { businessLicense } = formState.businessDocs;
    return !!businessLicense;
  }, [formState.businessDocs]);

  const isStep4Valid = useCallback((): boolean => {
    return formState.agreedToTerms;
  }, [formState.agreedToTerms]);

  const isStepValid = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return isStep1Valid();
        case 2:
          return isStep2Valid();
        case 3:
          return isStep3Valid();
        case 4:
          return isStep4Valid();
        default:
          return false;
      }
    },
    [isStep1Valid, isStep2Valid, isStep3Valid, isStep4Valid]
  );

  const getStepErrors = useCallback(
    (step: number): string[] => {
      const errors: string[] = [];

      switch (step) {
        case 1:
          if (!formState.businessInfo.businessName.trim())
            errors.push("Business name is required");
          if (!formState.businessInfo.businessAddress.trim())
            errors.push("Business address is required");
          if (!formState.businessInfo.city.trim())
            errors.push("City is required");
          if (!formState.businessInfo.state.trim())
            errors.push("State is required");
          if (!formState.businessInfo.zipCode.trim())
            errors.push("ZIP code is required");
          break;
        case 2:
          if (!formState.ownerIdentity.ownerFullName.trim())
            errors.push("Owner name is required");
          if (!formState.ownerIdentity.ownerIdFront)
            errors.push("Government-issued ID (front) is required");
          break;
        case 3:
          if (!formState.businessDocs.businessLicense)
            errors.push("Business license is required");
          break;
        case 4:
          if (!formState.agreedToTerms)
            errors.push("You must agree to the verification terms");
          break;
      }

      return errors;
    },
    [formState]
  );

  // =========================================================================
  // SUBMISSION
  // =========================================================================

  const submitVerification = useCallback(async () => {
    if (!user?.uid) {
      setFormState((prev) => ({
        ...prev,
        submitError: "You must be logged in to submit verification",
      }));
      return;
    }

    const brandId = `brand_${user.uid}`;

    // Validate all steps
    for (let step = 1; step <= TOTAL_STEPS; step++) {
      if (!isStepValid(step)) {
        const errors = getStepErrors(step);
        setFormState((prev) => ({
          ...prev,
          submitError: `Step ${step} has errors: ${errors.join(", ")}`,
        }));
        return;
      }
    }

    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
      submitError: null,
    }));

    try {
      const response = await fetch("/api/verification/submit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessInfo: formState.businessInfo,
          ownerIdentity: {
            ownerFullName: formState.ownerIdentity.ownerFullName,
            ownerIdFront: formState.ownerIdentity.ownerIdFront,
            ownerIdBack: formState.ownerIdentity.ownerIdBack,
          },
          businessDocs: {
            businessLicense: formState.businessDocs.businessLicense,
            certifications: formState.businessDocs.certifications,
            insurance: formState.businessDocs.insurance,
            taxDocument: formState.businessDocs.taxDocument,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit verification");
      }

      // Success - could redirect or show success state
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    } catch (err) {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        submitError: err instanceof Error ? err.message : "Submission failed",
      }));
    }
  }, [user, formState, isStepValid, getStepErrors]);

  // =========================================================================
  // RETURN
  // =========================================================================

  return {
    formState,
    currentStep: formState.currentStep,
    goToStep,
    nextStep,
    prevStep,
    canGoNext: formState.currentStep < TOTAL_STEPS && isStepValid(formState.currentStep),
    canGoPrev: formState.currentStep > 1,
    updateBusinessInfo,
    updateOwnerIdentity,
    updateBusinessDocs,
    addCertification,
    removeCertification,
    setAgreedToTerms,
    submitVerification,
    isSubmitting: formState.isSubmitting,
    submitError: formState.submitError,
    isStepValid,
    getStepErrors,
  };
}
