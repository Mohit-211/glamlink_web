"use client";
import { useRef, useState } from "react";

interface TopTreatmentFormProps {
    onBack: () => void;
    onSubmit: () => void;
}

type FieldKey =
    | "emailRecord"
    | "nameAndBusiness"
    | "email"
    | "treatmentDescription"
    | "importantLinks"
    | "bestFor"
    | "uniqueApproach"
    | "keyBenefits"
    | "durationFrequencyPrice"
    | "expectedResults"
    | "contraindications"
    | "tips"
    | "aftercare"
    | "combinations"
    | "consent";

type Fields = Record<FieldKey, string>;

interface Question {
    key: FieldKey;
    label: React.ReactNode;
    required?: boolean;
    type?: "textarea" | "radio-yn" | "email-checkbox";
}

const QUESTIONS: Question[] = [
    {
        key: "emailRecord",
        label: "Email",
        required: true,
        type: "email-checkbox",
    },
    {
        key: "nameAndBusiness",
        label: "Name + Business Name",
        required: true,
    },
    {
        key: "email",
        label: "Email",
        required: true,
    },
    {
        key: "treatmentDescription",
        label: "Name of treatment and description (up to 100 words)",
        required: true,
    },
    {
        key: "importantLinks",
        label: (
            <em style={{ fontStyle: "italic" }}>
                Please share any important links you want referenced?  Socials, Booking Links, etc
            </em>
        ),
        required: true,
    },
];

const AFTER_UPLOAD_QUESTIONS: Question[] = [
    {
        key: "bestFor",
        label: "Who is treatment best for? (skin types, concerns, ideal candidate)",
        required: true,
    },
    {
        key: "uniqueApproach",
        label: "How is your approach unique?",
        required: true,
    },
    {
        key: "keyBenefits",
        label: "Key Benefits (3-5)",
        required: true,
    },
    {
        key: "durationFrequencyPrice",
        label: "Duration (how long does treatment take), frequency (how often should this treatment be done), price range",
        required: true,
    },
    {
        key: "expectedResults",
        label: "Expected Results",
        required: true,
    },
    {
        key: "contraindications",
        label: "Who should NOT do this treatment? (contraindications)",
        required: true,
    },
    {
        key: "tips",
        label: "Name 3 Tips (ie. Dont do treatment before or after 2 weeks of getting botox)",
        required: true,
    },
    {
        key: "aftercare",
        label: "What aftercare is essential for this treatment?",
        required: true,
    },
    {
        key: "combinations",
        label: "Do you combine this treatment with others?",
        required: true,
    },
    {
        key: "consent",
        label: "I agree that The Glamlink Edit and its affiliated platforms may share my submitted content for promotional and editorial purposes.",
        required: true,
        type: "radio-yn",
    },
];

export default function TopTreatmentForm({ onBack, onSubmit }: TopTreatmentFormProps) {
    const [fields, setFields] = useState<Fields>({
        emailRecord: "",
        nameAndBusiness: "",
        email: "",
        treatmentDescription: "",
        importantLinks: "",
        bestFor: "",
        uniqueApproach: "",
        keyBenefits: "",
        durationFrequencyPrice: "",
        expectedResults: "",
        contraindications: "",
        tips: "",
        aftercare: "",
        combinations: "",
        consent: "",
    });

    const [emailChecked, setEmailChecked] = useState(false);
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const mediaRef = useRef<HTMLInputElement>(null);

    const handleChange = (key: FieldKey, value: string) => {
        setFields((prev) => ({ ...prev, [key]: value }));
    };

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length > 10) return void alert("Max 10 files allowed");
        const valid = files.filter((f) => f.size <= 10 * 1024 * 1024);
        if (valid.length !== files.length) alert("Some files exceeded 10MB and were removed");
        setMediaFiles(valid);
    };

    const handleClear = () => {
        setFields({
            emailRecord: "", nameAndBusiness: "", email: "", treatmentDescription: "",
            importantLinks: "", bestFor: "", uniqueApproach: "", keyBenefits: "",
            durationFrequencyPrice: "", expectedResults: "", contraindications: "",
            tips: "", aftercare: "", combinations: "", consent: "",
        });
        setEmailChecked(false);
        setMediaFiles([]);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
<p style={{ fontSize: 14, fontWeight: 500, color: "#5b4bb5", marginBottom: 4 }}>
                Top Treatment Feature For The Glamlink Edit
            </p>
             <p style={{ fontSize: 13, color: "#444", lineHeight: 1.6, marginBottom: 4 }}>
               This editorial feature highlights one signature treatment or service you offer, positioning you as an expert while educating consumers on what it is, who it’s for and the results they can expect. Your feature will include a structured article, professional images, and a QR code linking to your booking page and your social media.
            </p>
            {/* Before-upload questions */}
            {QUESTIONS.map((q) => (
                <QuestionCard key={q.key} label={q.label} required={q.required}>
                    {q.type === "email-checkbox" ? (
                        <div style={{ marginTop: 4 }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#444", cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={emailChecked}
                                    onChange={(e) => setEmailChecked(e.target.checked)}
                                    style={{ width: 16, height: 16, accentColor: "#5b4bb5", cursor: "pointer" }}
                                />
                                Record as the email to be included with my response
                            </label>
                        </div>
                    ) : (
                        <AutoTextarea value={fields[q.key]} onChange={(v) => handleChange(q.key, v)} />
                    )}
                </QuestionCard>
            ))}

            {/* Media upload */}
            <div style={{ background: "#fff", border: "0.5px solid #e0dfd8", borderRadius: 12, padding: "20px 22px" }}>
                <p style={{ fontSize: 14, color: "#1a1a1a", marginBottom: 4 }}>
                    Add 3-6 photos and you can include a short demo video
                    <span style={{ color: "#d93025", marginLeft: 2 }}>*</span>
                </p>
                <p style={{ fontSize: 12, color: "#888780", marginBottom: 10 }}>
                    Upload up to 10 supported files. Max 10 MB per file.
                </p>
                <div style={{ display: "inline-block" }}>
                    <button
                        type="button"
                        onClick={() => mediaRef.current?.click()}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            color: "#5b4bb5",
                            fontSize: 14,
                            background: "#fff",
                            border: "1px solid #c8c7c0",
                            borderRadius: 4,
                            padding: "6px 14px",
                            cursor: "pointer",
                            fontFamily: "inherit",
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5b4bb5" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Add file
                    </button>
                    <input
                        ref={mediaRef}
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        style={{ display: "none" }}
                        onChange={handleMediaChange}
                    />
                </div>
                {mediaFiles.length > 0 && (
                    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                        {mediaFiles.map((f, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5f5e5a" }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                                {f.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* After-upload questions */}
            {AFTER_UPLOAD_QUESTIONS.map((q) => (
                <QuestionCard key={q.key} label={q.label} required={q.required}>
                    {q.type === "radio-yn" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                            {["Yes", "No"].map((opt) => (
                                <label key={opt} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer" }}>
                                    <input
                                        type="radio"
                                        name={`radio-${q.key}`}
                                        checked={fields[q.key] === opt}
                                        onChange={() => handleChange(q.key, opt)}
                                        style={{ width: 16, height: 16, accentColor: "#5b4bb5", cursor: "pointer" }}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    ) : (
                        <AutoTextarea value={fields[q.key]} onChange={(v) => handleChange(q.key, v)} />
                    )}
                </QuestionCard>
            ))}

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
                <button onClick={onSubmit} style={primaryBtnStyle}>Next</button>
                <button onClick={handleClear} style={clearBtnStyle}>Clear form</button>
            </div>

        </div>
    );
}

/* ── Sub-components ── */

function QuestionCard({
    label,
    required,
    children,
}: {
    label: React.ReactNode;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div style={{
            background: "#fff",
            border: "0.5px solid #e0dfd8",
            borderRadius: 12,
            padding: "20px 22px",
        }}>
            <p style={{ fontSize: 14, color: "#1a1a1a", lineHeight: 1.6, marginBottom: 10 }}>
                {label}
                {required && <span style={{ color: "#d93025", marginLeft: 2 }}>*</span>}
            </p>
            {children}
        </div>
    );
}

function AutoTextarea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <textarea
            value={value}
            placeholder="Your answer"
            rows={1}
            onChange={(e) => onChange(e.target.value)}
            onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = el.scrollHeight + "px";
            }}
            onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#5b4bb5")}
            onBlur={(e) => (e.currentTarget.style.borderBottomColor = "#c8c7c0")}
            style={{
                width: "100%",
                border: "none",
                borderBottom: "1.5px solid #c8c7c0",
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