"use client";

/**
 * StepIndicator - Progress indicator for multi-step verification form
 */

import { Check } from "lucide-react";
import { VERIFICATION_STEPS } from "../../config";

interface StepIndicatorProps {
  currentStep: number;
  isStepValid: (step: number) => boolean;
  onStepClick?: (step: number) => void;
}

export default function StepIndicator({
  currentStep,
  isStepValid,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden sm:flex items-center justify-between">
        {VERIFICATION_STEPS.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number && isStepValid(step.number);
          const isPastOrCurrent = currentStep >= step.number;

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <button
                type="button"
                onClick={() => onStepClick?.(step.number)}
                disabled={!onStepClick || step.number > currentStep}
                className={`
                  relative flex items-center justify-center w-10 h-10 rounded-full
                  font-semibold text-sm transition-all duration-200
                  ${
                    isCompleted
                      ? "bg-glamlink-teal text-white"
                      : isActive
                      ? "bg-glamlink-teal text-white ring-4 ring-glamlink-teal/20"
                      : "bg-gray-200 text-gray-500"
                  }
                  ${onStepClick && step.number <= currentStep ? "cursor-pointer hover:scale-105" : "cursor-default"}
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </button>

              {/* Step Label */}
              <div className="ml-3 flex-shrink-0">
                <p
                  className={`text-sm font-medium ${
                    isPastOrCurrent ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < VERIFICATION_STEPS.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-4 transition-colors duration-200
                    ${isCompleted ? "bg-glamlink-teal" : "bg-gray-200"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="sm:hidden">
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-3">
          {VERIFICATION_STEPS.map((step) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div
                key={step.number}
                className={`
                  flex-1 h-2 rounded-full transition-colors duration-200
                  ${
                    isCompleted
                      ? "bg-glamlink-teal"
                      : isActive
                      ? "bg-glamlink-teal"
                      : "bg-gray-200"
                  }
                `}
              />
            );
          })}
        </div>

        {/* Current Step Info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Step {currentStep} of {VERIFICATION_STEPS.length}
            </p>
            <p className="text-base font-medium text-gray-900">
              {VERIFICATION_STEPS[currentStep - 1]?.label}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {VERIFICATION_STEPS.map((step) => (
              <button
                key={step.number}
                type="button"
                onClick={() => onStepClick?.(step.number)}
                disabled={!onStepClick || step.number > currentStep}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                  transition-colors duration-200
                  ${
                    currentStep === step.number
                      ? "bg-glamlink-teal text-white"
                      : currentStep > step.number
                      ? "bg-glamlink-teal/20 text-glamlink-teal"
                      : "bg-gray-100 text-gray-400"
                  }
                  ${onStepClick && step.number <= currentStep ? "cursor-pointer" : "cursor-default"}
                `}
              >
                {currentStep > step.number ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.shortLabel
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
