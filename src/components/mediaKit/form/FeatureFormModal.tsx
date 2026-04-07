"use client";
import { useState } from "react";
import CoverFeatureForm from "./CoverFeatureForm";
import ProSpotlightForm from "./ProSpotlightForm";
import TopTreatmentForm from "./TopTreatmentForm";
import InspiringStoriesForm from "./InspiringStoriesForm";
import BusinessSpotlightAdForm from "./BusinessSpotlightAdForm";

interface Props {
    onClose: () => void;
}

const FEATURE_TYPES = [
    "Cover Feature",
    "Pro Spotlight",
    "Top Treatment",
    "Inspiring Stories",
    "Business Spotlight Ad",
] as const;

type FeatureType = (typeof FEATURE_TYPES)[number];

type FieldKey =
    | "name"
    | "brand"
    | "profession"
    | "location"
    | "bookingLink"
    | "social";

interface FormState {
    name: string;
    brand: string;
    profession: string;
    location: string;
    bookingLink: string;
    social: string;
    featureType: FeatureType | "";
}

const FIELDS: { key: FieldKey; label: string; required?: boolean }[] = [
    {
        key: "name",
        label: "Name as you'd like it to appear in the feature?",
        required: true,
    },
    {
        key: "brand",
        label: "Business/Brand Name",
        required: true,
    },
    {
        key: "profession",
        label: "Profession/Specialty (Founder, Wellness Practitioner, Medspa Owner, Nurse Injector, Esthetician, Hair Brand, PMU Artist, etc)",
        required: true,
    },
    {
        key: "location",
        label: "City & State you are based in",
        required: true,
    },
    {
        key: "bookingLink",
        label: "Where can readers book your services or shop your products? Paste your direct link below.",
        required: true,
    },
    {
        key: "social",
        label: "What are your social handles? Instagram? Tiktok?",
        required: true,
    },
];

export default function FeatureFormModal({ onClose }: Props) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [form, setForm] = useState<FormState>({
        name: "",
        brand: "",
        profession: "",
        location: "",
        bookingLink: "",
        social: "",
        featureType: "",
    });
    const [touched, setTouched] = useState<Partial<Record<FieldKey | "featureType", boolean>>>({});
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const handleChange = (key: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleBlur = (key: FieldKey | "featureType") => {
        setTouched((prev) => ({ ...prev, [key]: true }));
    };

    const handleClear = () => {
        setForm({
            name: "",
            brand: "",
            profession: "",
            location: "",
            bookingLink: "",
            social: "",
            featureType: "",
        });
        setTouched({});
        setSubmitAttempted(false);
    };

    const isFieldInvalid = (key: FieldKey | "featureType") => {
        const value = form[key];
        return !value.trim();
    };

    const showError = (key: FieldKey | "featureType") => {
        return (touched[key] || submitAttempted) && isFieldInvalid(key);
    };

    const isFormValid = () => {
        const allFieldsFilled = FIELDS.every(({ key }) => form[key].trim() !== "");
        return allFieldsFilled && form.featureType !== "";
    };

    const handleNext = () => {
        setSubmitAttempted(true);
        if (!isFormValid()) return;
        setStep(2);
    };

    const handleSubmit = () => setStep(3);

    const renderFeatureForm = () => {
        const commonProps = { onBack: () => setStep(1), onSubmit: handleSubmit };
        switch (form.featureType) {
            case "Cover Feature":         return <CoverFeatureForm {...commonProps} />;
            case "Pro Spotlight":         return <ProSpotlightForm {...commonProps} />;
            case "Top Treatment":         return <TopTreatmentForm {...commonProps} />;
            case "Inspiring Stories":     return <InspiringStoriesForm {...commonProps} />;
            case "Business Spotlight Ad": return <BusinessSpotlightAdForm {...commonProps} />;
            default:
                return <p style={{ fontSize: 14, color: "#888" }}>Please go back and select a feature type.</p>;
        }
    };

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 50,
            background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
        }}>
            <div style={{
                background: "#fff",
                width: "100%",
                maxWidth: 620,
                borderRadius: 16,
                boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
            }}>

                {/* HEADER */}
                <div style={{
                    padding: "16px 24px",
                    borderBottom: "1px solid #f0efe8",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "sticky",
                    top: 0,
                    background: "#fff",
                    zIndex: 10,
                    borderRadius: "16px 16px 0 0",
                }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
                        FEATURE IN THE GLAMLINK EDIT
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        style={{
                            background: "none", border: "none",
                            fontSize: 18, cursor: "pointer", color: "#555",
                            lineHeight: 1, padding: 4,
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>

                        <p style={{ fontSize: 13, color: "#444", lineHeight: 1.6, marginBottom: 4 }}>
                            Apply to be featured in The Glamlink Edit, our editorial platform highlighting
                            standout beauty and wellness professionals. Select the type of feature you'd
                            like to be considered for — from Cover Feature and expert interviews to
                            trending Treatments, or a powerful client impact moments.
                        </p>

                        <p style={{ fontSize: 12, color: "#d93025", marginBottom: 4 }}>
                            * Indicates required question
                        </p>

                        {/* Text fields */}
                        {FIELDS.map(({ key, label }) => (
                            <QuestionCard
                                key={key}
                                label={label}
                                required
                                error={showError(key) ? "This field is required." : undefined}
                            >
                                <AutoTextarea
                                    value={form[key]}
                                    onChange={(v) => handleChange(key, v)}
                                    onBlur={() => handleBlur(key)}
                                    hasError={showError(key)}
                                />
                            </QuestionCard>
                        ))}

                        {/* Feature type radio */}
                        <QuestionCard
                            label="What type of feature are you applying for?"
                            required
                            error={showError("featureType") ? "Please select a feature type." : undefined}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                                {FEATURE_TYPES.map((type) => (
                                    <label key={type} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer" }}>
                                        <input
                                            type="radio"
                                            name="featureType"
                                            checked={form.featureType === type}
                                            onChange={() => {
                                                handleChange("featureType", type);
                                                handleBlur("featureType");
                                            }}
                                            style={{ width: 16, height: 16, accentColor: "#5b4bb5", cursor: "pointer" }}
                                        />
                                        {type}
                                    </label>
                                ))}
                            </div>
                        </QuestionCard>

                        {/* Actions */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
                            
                            <button onClick={handleNext} style={{ ...primaryBtnStyle }}>
                                Next
                            </button>
                            <button onClick={handleClear} style={clearBtnStyle}>Clear form</button>
                        </div>
                    </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
                        {renderFeatureForm()}
                    </div>
                )}

                {/* STEP 3 — Thank You */}
                {step === 3 && (
                    <div style={{
                        flex: 1, overflowY: "auto", padding: 40,
                        textAlign: "center", display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: 16,
                    }}>
                        <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
                            Thank You For Applying ✨
                        </h3>
                        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>
                            Please allow 1–3 business days for review.
                        </p>
                        <button onClick={onClose} style={{ ...primaryBtnStyle, marginTop: 8 }}>
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Sub-components ── */

function QuestionCard({
    label,
    required,
    error,
    children,
}: {
    label: React.ReactNode;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div style={{
            background: "#fff",
            border: `0.5px solid ${error ? "#d93025" : "#e0dfd8"}`,
            borderRadius: 12,
            padding: "20px 22px",
        }}>
            <p style={{ fontSize: 14, color: "#1a1a1a", lineHeight: 1.6, marginBottom: 10 }}>
                {label}
                {required && <span style={{ color: "#d93025", marginLeft: 2 }}>*</span>}
            </p>
            {children}
            {error && (
                <p style={{ fontSize: 12, color: "#d93025", marginTop: 6, marginBottom: 0 }}>
                    {error}
                </p>
            )}
        </div>
    );
}

function AutoTextarea({
    value,
    onChange,
    onBlur,
    hasError,
}: {
    value: string;
    onChange: (v: string) => void;
    onBlur?: () => void;
    hasError?: boolean;
}) {
    return (
        <textarea
            value={value}
            placeholder="Your answer"
            rows={1}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = el.scrollHeight + "px";
            }}
            onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#5b4bb5")}
            style={{
                width: "100%",
                border: "none",
                borderBottom: `1.5px solid ${hasError ? "#d93025" : "#c8c7c0"}`,
                borderRadius: 0,
                padding: "5px 0",
                fontSize: 14,
                color: "#1a1a1a",
                background: "transparent",
                outline: "none",
                resize: "none",
                overflow: "hidden",
                lineHeight: 1.6,
                minHeight: 32,
                fontFamily: "inherit",
            }}
        />
    );
}

const primaryBtnStyle: React.CSSProperties = {
    background: "#5b4bb5",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "10px 28px",
    fontSize: 14,
    fontFamily: "inherit",
    cursor: "pointer",
};

const clearBtnStyle: React.CSSProperties = {
    background: "none",
    color: "#5b4bb5",
    border: "none",
    fontSize: 14,
    fontFamily: "inherit",
    cursor: "pointer",
};