"use client";

/**
 * VerificationForm - Multi-step verification form orchestrator
 */

import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react";
import { useVerificationForm } from "../../hooks/useVerificationForm";
import StepIndicator from "./StepIndicator";
import Step1BusinessInfo from "./Step1BusinessInfo";
import Step2OwnerIdentity from "./Step2OwnerIdentity";
import Step3BusinessDocs from "./Step3BusinessDocs";
import Step4Review from "./Step4Review";

interface VerificationFormProps {
  onSuccess?: () => void;
}

export default function VerificationForm({ onSuccess }: VerificationFormProps) {
  const {
    formState,
    currentStep,
    goToStep,
    nextStep,
    prevStep,
    canGoNext,
    canGoPrev,
    updateBusinessInfo,
    updateOwnerIdentity,
    updateBusinessDocs,
    addCertification,
    removeCertification,
    setAgreedToTerms,
    submitVerification,
    isSubmitting,
    submitError,
    isStepValid,
    getStepErrors,
  } = useVerificationForm();

  const handleSubmit = async () => {
    await submitVerification();
    if (!submitError) {
      onSuccess?.();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BusinessInfo
            data={formState.businessInfo}
            onChange={updateBusinessInfo}
            errors={getStepErrors(1)}
          />
        );
      case 2:
        return (
          <Step2OwnerIdentity
            data={formState.ownerIdentity}
            onChange={updateOwnerIdentity}
            errors={getStepErrors(2)}
          />
        );
      case 3:
        return (
          <Step3BusinessDocs
            data={formState.businessDocs}
            onChange={updateBusinessDocs}
            onAddCertification={addCertification}
            onRemoveCertification={removeCertification}
            errors={getStepErrors(3)}
          />
        );
      case 4:
        return (
          <Step4Review
            businessInfo={formState.businessInfo}
            ownerIdentity={formState.ownerIdentity}
            businessDocs={formState.businessDocs}
            agreedToTerms={formState.agreedToTerms}
            onAgreeToTerms={setAgreedToTerms}
            onEditStep={goToStep}
            errors={getStepErrors(4)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <StepIndicator
          currentStep={currentStep}
          isStepValid={isStepValid}
          onStepClick={goToStep}
        />
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        {renderStep()}

        {/* Submit Error */}
        {submitError && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={!canGoPrev || isSubmitting}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors
              ${
                canGoPrev && !isSubmitting
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-gray-300 cursor-not-allowed"
              }
            `}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canGoNext || isSubmitting}
              className={`
                flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-colors
                ${
                  canGoNext && !isSubmitting
                    ? "bg-glamlink-teal text-white hover:bg-glamlink-teal/90"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isStepValid(4) || isSubmitting}
              className={`
                flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-colors
                ${
                  isStepValid(4) && !isSubmitting
                    ? "bg-glamlink-teal text-white hover:bg-glamlink-teal/90"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit for Review
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
