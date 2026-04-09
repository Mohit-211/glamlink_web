"use client";
import { useState } from "react";

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

                {/* STEP 1 — Form */}
                {step === 1 && (
                    <div style={{
                        flex: 1, overflowY: "auto", padding: "20px 24px",
                        display: "flex", flexDirection: "column", gap: 10,
                    }}>
                        <p style={{ fontSize: 13, color: "#444", lineHeight: 1.6, marginBottom: 4 }}>
                            Apply to be featured in The Glamlink Edit, our editorial platform highlighting
                            standout beauty and wellness professionals. Select the type of feature you'd
                            like to be considered for — from Cover Feature and expert interviews to
                            trending Treatments, or powerful client impact moments.
                        </p>

                        <p style={{ fontSize: 12, color: "#d93025", marginBottom: 4 }}>
                            * Indicates required question
                        </p>

                        {/* Name + Specialty */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <QuestionCard
                                label="Name as you'd like it to appear"
                                required
                                error={showError("name") ? "This field is required." : undefined}
                            >
                                <AutoTextarea
                                    value={form.name}
                                    onChange={(v) => handleChange("name", v)}
                                    onBlur={() => handleBlur("name")}
                                    hasError={showError("name")}
                                />
                            </QuestionCard>

                            <QuestionCard
                                label="Specialty"
                                required
                                error={showError("specialty") ? "This field is required." : undefined}
                            >
                                <AutoTextarea
                                    value={form.specialty}
                                    placeholder="Nurse Injector, Esthetician…"
                                    onChange={(v) => handleChange("specialty", v)}
                                    onBlur={() => handleBlur("specialty")}
                                    hasError={showError("specialty")}
                                />
                            </QuestionCard>
                        </div>

                        {/* Email + Phone */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <QuestionCard
                                label="Email"
                                required
                                error={showError("email") ? "Please enter a valid email." : undefined}
                            >
                                <AutoTextarea
                                    value={form.email}
                                    placeholder="jane@example.com"
                                    onChange={(v) => handleChange("email", v)}
                                    onBlur={() => handleBlur("email")}
                                    hasError={showError("email")}
                                />
                            </QuestionCard>

                            <QuestionCard
                                label="Phone Number"
                                required
                                error={showError("phone") ? "This field is required." : undefined}
                            >
                                <AutoTextarea
                                    value={form.phone}
                                    placeholder="+1 555 000 0000"
                                    onChange={(v) => handleChange("phone", v)}
                                    onBlur={() => handleBlur("phone")}
                                    hasError={showError("phone")}
                                />
                            </QuestionCard>
                        </div>

                        {/* City */}
                        <QuestionCard
                            label="City"
                            required
                            error={showError("city") ? "This field is required." : undefined}
                        >
                            <AutoTextarea
                                value={form.city}
                                placeholder="Los Angeles, CA"
                                onChange={(v) => handleChange("city", v)}
                                onBlur={() => handleBlur("city")}
                                hasError={showError("city")}
                            />
                        </QuestionCard>

                        {/* Interest dropdown */}
                        <QuestionCard
                            label="What are you interested in?"
                            required
                            error={showError("interest") ? "Please select a feature type." : undefined}
                        >
                            <select
                                value={form.interest}
                                onChange={(e) => {
                                    handleChange("interest", e.target.value);
                                    handleBlur("interest");
                                }}
                                onBlur={() => handleBlur("interest")}
                                style={{
                                    width: "100%",
                                    border: "none",
                                    borderBottom: `1.5px solid ${showError("interest") ? "#d93025" : "#c8c7c0"}`,
                                    borderRadius: 0,
                                    padding: "5px 0",
                                    fontSize: 14,
                                    color: form.interest ? "#1a1a1a" : "#999",
                                    background: "transparent",
                                    outline: "none",
                                    fontFamily: "inherit",
                                    cursor: "pointer",
                                    appearance: "auto",
                                }}
                            >
                                <option value="" disabled>Select a feature type…</option>
                                {INTEREST_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </QuestionCard>

                        {/* Actions */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
                            <button onClick={handleSubmit} style={primaryBtnStyle}>
                                Submit
                            </button>
                            <button onClick={handleClear} style={clearBtnStyle}>Clear form</button>
                        </div>
                    </div>
                )}

                {/* STEP 2 — Thank You */}
                {step === 2 && (
                    <div style={{
                        flex: 1, overflowY: "auto", padding: 40,
                        textAlign: "center", display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: 16,
                    }}>
                        <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>
                            Thank You! ✨
                        </h3>
                        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>
                            We'll review your submission and reach out shortly.
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
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    onBlur?: () => void;
    hasError?: boolean;
    placeholder?: string;
}) {
    return (
        <textarea
            value={value}
            placeholder={placeholder ?? "Your answer"}
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