"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import {
  PARTNER_INTEREST_OPTIONS,
  submitPartnerInquiry,
  type PartnerInquiry,
} from "@/lib/partner/partnerInquiry";
import FormSuccessState from "./FormSuccessState";
import { INQUIRY_SECTION_ID } from "./partnerContent";

const EMPTY_VALUES: PartnerInquiry = {
  name: "",
  company: "",
  email: "",
  website: "",
  interests: [],
  message: "",
};

const inputClass = (hasError: boolean) =>
  `mt-4 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-ring ${
    hasError ? "border-red-400" : "border-input"
  }`;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-red-600">
      {message}
    </p>
  );
}

function Label({ htmlFor, children, optional }: { htmlFor: string; children: string; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
      {children}
      {optional ? (
        <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
      ) : (
        <span className="ml-0.5 text-primary" aria-hidden="true">*</span>
      )}
    </label>
  );
}

export default function PartnershipInquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Guards against double submits before React re-renders the disabled button.
  const inFlight = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PartnerInquiry>({ defaultValues: EMPTY_VALUES });

  const selectedInterests = watch("interests") ?? [];

  const onSubmit = async (values: PartnerInquiry) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setSubmitError(null);

    try {
      await submitPartnerInquiry(values);
      reset(EMPTY_VALUES);
      setSubmitted(true);
      document.getElementById(INQUIRY_SECTION_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      setSubmitError("Something went wrong sending your inquiry. Please try again in a moment.");
    } finally {
      inFlight.current = false;
    }
  };

  if (submitted) return <FormSuccessState onReset={() => setSubmitted(false)} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6" aria-busy={isSubmitting}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="partner-name">Name</Label>
          <input
            id="partner-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "partner-name-error" : undefined}
            className={inputClass(!!errors.name)}
            {...register("name", {
              required: "Please enter your name",
              validate: (v) => v.trim().length > 0 || "Please enter your name",
            })}
          />
          <FieldError id="partner-name-error" message={errors.name?.message} />
        </div>

        <div>
          <Label htmlFor="partner-company">Company / Brand</Label>
          <input
            id="partner-company"
            type="text"
            autoComplete="organization"
            placeholder="Your company or brand"
            aria-invalid={!!errors.company}
            aria-describedby={errors.company ? "partner-company-error" : undefined}
            className={inputClass(!!errors.company)}
            {...register("company", {
              required: "Please enter your company or brand",
              validate: (v) => v.trim().length > 0 || "Please enter your company or brand",
            })}
          />
          <FieldError id="partner-company-error" message={errors.company?.message} />
        </div>

        <div>
          <Label htmlFor="partner-email">Email</Label>
          <input
            id="partner-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "partner-email-error" : undefined}
            className={inputClass(!!errors.email)}
            {...register("email", {
              required: "Please enter your email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email",
              },
            })}
          />
          <FieldError id="partner-email-error" message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="partner-website" optional>
            Website or Instagram
          </Label>
          <input
            id="partner-website"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="yourbrand.com or @yourbrand"
            className={inputClass(false)}
            {...register("website")}
          />
        </div>
      </div>

      {/* Interests — multi-select chips */}
      <fieldset>
        <legend className="text-sm font-medium text-foreground">
          I&apos;m interested in
          <span className="ml-1 font-normal text-muted-foreground">(select all that apply)</span>
        </legend>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {PARTNER_INTEREST_OPTIONS.map((option) => {
            const checked = selectedInterests.includes(option);
            return (
              <label
                key={option}
                className={`inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${
                  checked
                    ? "border-primary bg-primary text-primary-foreground shadow-primary"
                    : "border-input bg-background text-foreground hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <input type="checkbox" value={option} className="sr-only" {...register("interests")} />
                {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />}
                {option}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <Label htmlFor="partner-message">
          Tell us about your brand/business and what you&apos;re interested in
        </Label>
        <textarea
          id="partner-message"
          rows={6}
          placeholder="Share your goals, timing and anything else that would help us understand the opportunity."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "partner-message-error" : undefined}
          className={`${inputClass(!!errors.message)} resize-y min-h-[150px]`}
          {...register("message", {
            required: "Please tell us a little about your brand or business",
            validate: (v) =>
              v.trim().length >= 10 || "A few more details would help us understand the opportunity",
          })}
        />
        <FieldError id="partner-message-error" message={errors.message?.message} />
      </div>

      {submitError && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full px-10 py-4 uppercase tracking-wider disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Submitting…
          </>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
