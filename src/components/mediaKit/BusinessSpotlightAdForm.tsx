"use client";
import { useRef, useState } from "react";

interface BusinessSpotlightAdFormProps {
    onBack: () => void;
    onSubmit: () => void;
}

type FieldKey = "tagline" | "anythingElse" | "consent";
type Fields = Record<FieldKey, string>;

export default function BusinessSpotlightAdForm({ onBack, onSubmit }: BusinessSpotlightAdFormProps) {
    const [fields, setFields] = useState<Fields>({
        tagline: "",
        anythingElse: "",
        consent: "",
    });

    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const mediaRef = useRef<HTMLInputElement>(null);

    const handleChange = (key: FieldKey, value: string) => {
        setFields((prev) => ({ ...prev, [key]: value }));
    };

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            alert("File exceeds 10MB limit");
            return;
        }
        setMediaFile(file);
    };

    const handleRemoveFile = () => {
        setMediaFile(null);
        if (mediaRef.current) mediaRef.current.value = "";
    };

    const handleClear = () => {
        setFields({ tagline: "", anythingElse: "", consent: "" });
        setMediaFile(null);
        if (mediaRef.current) mediaRef.current.value = "";
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#5b4bb5", marginBottom: 4 }}>
                Business Spotlight Ad
            </p>
            <p style={{ fontSize: 13, color: "#444", lineHeight: 1.6, marginBottom: 4 }}>
                A full-page visual placement designed to showcase your brand, space, or signature work.
                Includes one featured image, your name and location, a custom tagline, and a QR code
                connecting readers directly to your business.
            </p>

            {/* Photo upload */}
            <div style={{ background: "#fff", border: "0.5px solid #e0dfd8", borderRadius: 12, padding: "20px 22px" }}>
                <p style={{ fontSize: 14, color: "#1a1a1a", lineHeight: 1.6, marginBottom: 4 }}>
                    Upload one high-quality, well-lit photo that best represents your business, space,
                    treatment, or signature work. Clean backgrounds and professional lighting photograph
                    best in print.
                    <span style={{ color: "#d93025", marginLeft: 2 }}>*</span>
                </p>
                <p style={{ fontSize: 12, color: "#888780", marginBottom: 10 }}>
                    Upload 1 supported file. Max 10 MB.
                </p>

                {mediaFile && (
                    <div style={{ marginBottom: 10 }}>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                background: "#f6f5f0",
                                borderRadius: 4,
                                padding: "6px 10px",
                                fontSize: 13,
                                color: "#5f5e5a",
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5b4bb5" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                            <span>{mediaFile.name}</span>
                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 2,
                                    color: "#888",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

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
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleMediaChange}
                    />
                </div>
            </div>

            {/* Tagline */}
            <QuestionCard
                label="Share a short tagline that represents your brand's focus, expertise, or signature experience. (One sentence max)"
                required
            >
                <AutoTextarea
                    value={fields.tagline}
                    onChange={(v) => handleChange("tagline", v)}
                />
            </QuestionCard>

            {/* Anything else */}
            <QuestionCard label="Anything else you want us to know?">
                <AutoTextarea
                    value={fields.anythingElse}
                    onChange={(v) => handleChange("anythingElse", v)}
                />
            </QuestionCard>

            {/* Consent */}
            <QuestionCard
                label="I agree that The Glamlink Edit and its affiliated platforms may share my submitted content for promotional and editorial purposes."
                required
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                    {["Yes", "No"].map((opt) => (
                        <label key={opt} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer" }}>
                            <input
                                type="radio"
                                name="radio-consent"
                                checked={fields.consent === opt}
                                onChange={() => handleChange("consent", opt)}
                                style={{ width: 16, height: 16, accentColor: "#5b4bb5", cursor: "pointer" }}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            </QuestionCard>

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