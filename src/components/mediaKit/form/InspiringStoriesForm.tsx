"use client";
import { useRef, useState } from "react";

interface InspiringStoriesFormProps {
    onBack: () => void;
    onSubmit: () => void;
}

type FieldKey =
    | "storyDescription"
    | "editPermission"
    | "sharePermission";

type Fields = Record<FieldKey, string>;

export default function InspiringStoriesForm({ onBack, onSubmit }: InspiringStoriesFormProps) {
    const [fields, setFields] = useState<Fields>({
        storyDescription: "",
        editPermission: "",
        sharePermission: "",
    });

    const [emailChecked, setEmailChecked] = useState(false);
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const mediaRef = useRef<HTMLInputElement>(null);

    const handleChange = (key: FieldKey, value: string) => {
        setFields((prev) => ({ ...prev, [key]: value }));
    };

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length > 5) return void alert("Max 5 files allowed");
        const valid = files.filter((f) => f.size <= 10 * 1024 * 1024);
        if (valid.length !== files.length) alert("Some files exceeded 10MB and were removed");
        setMediaFiles((prev) => {
            const combined = [...prev, ...valid];
            if (combined.length > 5) {
                alert("Max 5 files allowed");
                return combined.slice(0, 5);
            }
            return combined;
        });
    };

    const handleRemoveFile = (index: number) => {
        setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleClear = () => {
        setFields({
            storyDescription: "",
            editPermission: "",
            sharePermission: "",
        });
        setEmailChecked(false);
        setMediaFiles([]);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#5b4bb5", marginBottom: 4 }}>

                Inspiring Stories Feature For The Glamlink Edit

            </p>
            <p style={{ fontSize: 13, color: "#444", lineHeight: 1.6, marginBottom: 4 }}>
                Share a meaningful moment from your journey in beauty or wellness. This section
                highlights real experiences, lessons, and client transformations that inspire and
                connect our community. Stories are selected for publication in The Glamlink Edit
                and may be featured across Glamlink platforms.
            </p>

            {/* Email checkbox */}
            <QuestionCard label="Email" required>
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
            </QuestionCard>

            {/* Story description */}
            <QuestionCard
                label="Describe a powerful experience, lesson, or client transformation that shaped your perspective in this industry."
                required
            >
                <AutoTextarea
                    value={fields.storyDescription}
                    onChange={(v) => handleChange("storyDescription", v)}
                />
            </QuestionCard>

            {/* Media upload */}
            <div style={{ background: "#fff", border: "0.5px solid #e0dfd8", borderRadius: 12, padding: "20px 22px" }}>
                <p style={{ fontSize: 14, color: "#1a1a1a", marginBottom: 4 }}>
                    Upload images that bring your story to life. This could be a client transformation,
                    a meaningful moment, or a visual that represents the experience you described.
                    <span style={{ color: "#d93025", marginLeft: 2 }}>*</span>
                </p>
                <p style={{ fontSize: 12, color: "#888780", marginBottom: 10 }}>
                    Upload up to 5 supported files. Max 10 MB per file.
                </p>

                {mediaFiles.length > 0 && (
                    <div style={{ marginBottom: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                        {mediaFiles.map((f, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
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
                                <span style={{ flex: 1 }}>{f.name}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFile(i)}
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
                        ))}
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
                        multiple
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleMediaChange}
                    />
                </div>
            </div>

            {/* Edit permission */}
            <QuestionCard
                label="Do you give The Glamlink Edit permission to lightly edit your story for clarity and formatting?"
                required
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                    {["Yes", "No"].map((opt) => (
                        <label key={opt} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer" }}>
                            <input
                                type="radio"
                                name="radio-editPermission"
                                checked={fields.editPermission === opt}
                                onChange={() => handleChange("editPermission", opt)}
                                style={{ width: 16, height: 16, accentColor: "#5b4bb5", cursor: "pointer" }}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            </QuestionCard>

            {/* Share permission */}
            <QuestionCard
                label="Do you grant permission for this story to be shared across Glamlink platforms, including social media and digital publications?"
                required
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                    {["Yes", "No"].map((opt) => (
                        <label key={opt} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer" }}>
                            <input
                                type="radio"
                                name="radio-sharePermission"
                                checked={fields.sharePermission === opt}
                                onChange={() => handleChange("sharePermission", opt)}
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