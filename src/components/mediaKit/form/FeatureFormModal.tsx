"use client";
import { useState } from "react";
import { X } from "lucide-react";

interface Props {
    onClose: () => void;
}

const INTEREST_OPTIONS = [
    "Cover Feature",
    "Pro Spotlight",
    "Top Treatment",
    "Inspiring Stories",
    "Innovation Feature",
] as const;

type InterestOption = (typeof INTEREST_OPTIONS)[number];

interface FormState {
    name: string;
    specialty: string;
    email: string;
    phone: string;
    city: string;
    interest: InterestOption | "";
}

type FieldKey = keyof FormState;

const INITIAL_FORM: FormState = {
    name: "",
    specialty: "",
    email: "",
    phone: "",
    city: "",
    interest: "",
};

export default function FeatureFormModal({ onClose }: Props) {
    const [step, setStep] = useState<1 | 2>(1);
    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const handleChange = (key: FieldKey, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleBlur = (key: FieldKey) => {
        setTouched((prev) => ({ ...prev, [key]: true }));
    };

    const handleClear = () => {
        setForm(INITIAL_FORM);
        setTouched({});
        setSubmitAttempted(false);
    };

    const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

    const isFieldInvalid = (key: FieldKey): boolean => {
        const value = form[key];
        if (key === "email") return !isEmailValid(value);
        return !value.trim();
    };

    const showError = (key: FieldKey) =>
        (touched[key] || submitAttempted) && isFieldInvalid(key);

    const isFormValid = () =>
        (Object.keys(INITIAL_FORM) as FieldKey[]).every((key) => !isFieldInvalid(key));

    const handleSubmit = () => {
        setSubmitAttempted(true);
        if (!isFormValid()) return;
        setStep(2);
    };

    const textFields: { key: Exclude<FieldKey, "interest">; label: string; placeholder: string; type?: string; error: string }[] = [
        { key: "name", label: "Name as you'd like it to appear", placeholder: "Your answer", error: "This field is required." },
        { key: "specialty", label: "Specialty", placeholder: "Nurse Injector, Esthetician…", error: "This field is required." },
        { key: "email", label: "Email", placeholder: "jane@example.com", type: "email", error: "Please enter a valid email." },
        { key: "phone", label: "Phone Number", placeholder: "+1 555 000 0000", type: "tel", error: "This field is required." },
        { key: "city", label: "City", placeholder: "Los Angeles, CA", error: "This field is required." },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
            <div className="flex max-h-[90vh] w-full max-w-[620px] flex-col overflow-hidden rounded-2xl bg-card shadow-large">

                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <h2 className="text-base font-semibold">Feature in The Glamlink Edit</h2>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* STEP 1 — Form */}
                {step === 1 && (
                    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
                        <p className="text-[13px] leading-relaxed text-muted-foreground">
                            Apply to be featured in The Glamlink Edit, our editorial platform highlighting
                            standout beauty and wellness professionals. Select the type of feature you&apos;d
                            like to be considered for — from Cover Feature and expert interviews to
                            trending Treatments, or powerful client impact moments.
                        </p>

                        <p className="text-xs text-destructive">* Indicates required question</p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {textFields.map(({ key, label, placeholder, type, error }) => (
                                <label key={key} className={key === "city" ? "sm:col-span-2" : undefined}>
                                    <span className="label-glamlink">
                                        {label} <span className="text-destructive">*</span>
                                    </span>
                                    <input
                                        type={type ?? "text"}
                                        value={form[key]}
                                        placeholder={placeholder}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        onBlur={() => handleBlur(key)}
                                        aria-invalid={showError(key)}
                                        className="input-glamlink"
                                    />
                                    {showError(key) && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}
                                </label>
                            ))}

                            <label className="sm:col-span-2">
                                <span className="label-glamlink">
                                    What are you interested in? <span className="text-destructive">*</span>
                                </span>
                                <select
                                    value={form.interest}
                                    onChange={(e) => {
                                        handleChange("interest", e.target.value);
                                        handleBlur("interest");
                                    }}
                                    onBlur={() => handleBlur("interest")}
                                    aria-invalid={showError("interest")}
                                    className={`input-glamlink cursor-pointer ${form.interest ? "" : "text-muted-foreground"}`}
                                >
                                    <option value="" disabled>Select a feature type…</option>
                                    {INTEREST_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                                {showError("interest") && (
                                    <span className="mt-1.5 block text-xs text-destructive">Please select a feature type.</span>
                                )}
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="mt-2 flex items-center gap-3">
                            <button onClick={handleSubmit} className="btn-primary">Submit</button>
                            <button onClick={handleClear} className="text-sm font-medium text-primary hover:underline">
                                Clear form
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2 — Thank You */}
                {step === 2 && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto p-10 text-center">
                        <h3 className="text-lg font-semibold">Thank You! ✨</h3>
                        <p className="text-sm text-muted-foreground">We&apos;ll review your submission and reach out shortly.</p>
                        <button onClick={onClose} className="btn-primary mt-2">Close</button>
                    </div>
                )}
            </div>
        </div>
    );
}
