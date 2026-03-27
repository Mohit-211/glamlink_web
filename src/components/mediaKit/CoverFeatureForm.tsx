"use client";
import { useRef, useState } from "react";

interface CoverFeatureFormProps {
    onBack: () => void;
    onSubmit: () => void;
}

type FieldKey =
    | "importantLinks" | "journey" | "challenge" | "uniqueApproach"
    | "favoriteService" | "proudestMoment" | "futureGoals" | "advice"
    | "achievements" | "favoriteQuote" | "favoriteProduct"
    | "interviewAddOn" | "anythingElse" | "specials" | "consent";

type Fields = Record<FieldKey, string>;

interface Question {
    key: FieldKey;
    label: React.ReactNode;
    required?: boolean;
    type?: "textarea" | "checkbox-yn" | "radio-yn";
}

const QUESTIONS: Question[] = [
    {
        key: "importantLinks",
        label: "Please share any important links you want referenced? Socials, Booking Links, etc",
        required: true,
    },
    {
        key: "journey",
        label: (
            <>
                Tell us a little bit about your journey in the beauty or wellness industry.{" "}
                <em style={{ fontStyle: "italic", color: "#5f5e5a" }}>How did you get started and what inspired you to do what you do?</em>
            </>
        ),
        required: true,
    },
    {
        key: "challenge",
        label: "What's one challenge you've faced in your career and how did you overcome it?",
        required: true,
    },
    {
        key: "uniqueApproach",
        label: (
            <>
                What sets your approach or services apart?{" "}
                <em style={{ fontStyle: "italic", color: "#5f5e5a" }}>Whether it's your technique, client experience or philosophy.</em>
            </>
        ),
        required: true,
    },
    {
        key: "favoriteService",
        label: "What's your favorite treatment/service/product to perform and why?",
        required: true,
    },
    {
        key: "proudestMoment",
        label: (
            <>
                What's been your proudest moment so far as a professional?{" "}
                <em style={{ fontStyle: "italic", color: "#5f5e5a" }}>Could be a client transformation, a milestone or personal growth</em>
            </>
        ),
        required: true,
    },
    {
        key: "futureGoals",
        label: (
            <>
                Where do you see your brand or business going next?{" "}
                <em style={{ fontStyle: "italic", color: "#5f5e5a" }}>Future goals, new services, or how you want to grow.</em>
            </>
        ),
        required: true,
    },
    {
        key: "advice",
        label: "What's one piece of advice you'd give to someone entering the industry today?",
        required: true,
    },
    {
        key: "achievements",
        label: "3–5 Achievements",
        required: true,
    },
    {
        key: "favoriteQuote",
        label: "Your favorite quote",
        required: true,
    },
    {
        key: "favoriteProduct",
        label: (
            <>
                Your favorite professional product{" "}
                <em style={{ fontStyle: "italic", color: "#5f5e5a" }}>
                    (ideally something you sell) and why. Please provide photos if you want it
                    featured in your article and the product link for e-commerce.
                </em>
            </>
        ),
        required: true,
    },
    {
        key: "interviewAddOn",
        label: (
            <>
                Would you like to add an in-studio interview hosted by TV Beauty Advisor + Editor in
                Chief, Marie Matteucci?{" "}
                <em style={{ fontStyle: "italic", color: "#5f5e5a" }}>(Available as an optional add-on)</em>
            </>
        ),
        required: true,
        type: "checkbox-yn",
    },
    {
        key: "anythingElse",
        label: "Is there anything else you want added in your feature?",
    },
    {
        key: "specials",
        label: "If you want to offer any specials please list here",
    },
    {
        key: "consent",
        label: "I agree that The Glamlink Edit and its affiliated platforms may share my submitted content for promotional and editorial purposes.",
        required: true,
        type: "radio-yn",
    },
];

export default function CoverFeatureForm({ onBack, onSubmit }: CoverFeatureFormProps) {
    const [fields, setFields] = useState<Fields>({
        importantLinks: "",
        journey: "",
        challenge: "",
        uniqueApproach: "",
        favoriteService: "",
        proudestMoment: "",
        futureGoals: "",
        advice: "",
        achievements: "",
        favoriteQuote: "",
        favoriteProduct: "",
        interviewAddOn: "",
        anythingElse: "",
        specials: "",
        consent: "",
    });

    const [headshotFiles, setHeadshotFiles] = useState<File[]>([]);
    const [workFiles, setWorkFiles] = useState<File[]>([]);

    const headshotRef = useRef<HTMLInputElement>(null);
    const workRef = useRef<HTMLInputElement>(null);

    const handleChange = (key: FieldKey, value: string) => {
        setFields((prev) => ({ ...prev, [key]: value }));
    };

    const handleHeadshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length > 5) return void alert("Max 5 headshots allowed");
        const valid = files.filter((f) => f.size <= 10 * 1024 * 1024);
        if (valid.length !== files.length) alert("Some files exceeded 10MB and were removed");
        setHeadshotFiles(valid);
    };

    const handleWorkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length > 10) return void alert("Max 10 files allowed");
        const valid = files.filter((f) => f.size <= 10 * 1024 * 1024);
        if (valid.length !== files.length) alert("Some files exceeded 10MB and were removed");
        setWorkFiles(valid);
    };

    const beforeUpload = QUESTIONS.slice(0, 8);
    const afterUpload = QUESTIONS.slice(8);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Section header */}
            <p style={{ fontSize: 14, fontWeight: 500, color: "#5b4bb5", marginBottom: 4 }}>
                Cover Feature For The Glamlink Edit
            </p>
             <p style={{ fontSize: 13, color: "#444", lineHeight: 1.6, marginBottom: 4 }}>
            The Cover Feature is for standout professionals and brands making a significant impact in the beauty and wellness industry. Tell us about your journey, your work, and the vision behind your brand.  Cover features are offered as premium paid editorial placements and selected applicants will receive full feature details, investment information and next steps. 
            </p>

            {/* Questions before uploads */}
            {beforeUpload.map((q) => (
                <QuestionCard key={q.key} label={q.label} required={q.required}>
                    <AutoTextarea value={fields[q.key]} onChange={(v) => handleChange(q.key, v)} />
                </QuestionCard>
            ))}

            {/* Headshots upload */}
            <UploadCard
                label="Headshots"
                required
                hint="Upload up to 5 supported files. Max 10 MB per file."
                files={headshotFiles}
                inputRef={headshotRef}
                accept="image/*"
                onChange={handleHeadshotChange}
            />

            {/* Work photos upload */}
            <UploadCard
                label="3–6 Photos Of Your Work"
                required
                hint="Upload up to 10 supported files. Max 10 MB per file."
                files={workFiles}
                inputRef={workRef}
                accept="image/*"
                onChange={handleWorkChange}
            />

            {/* Questions after uploads */}
            {afterUpload.map((q) => (
                <QuestionCard key={q.key} label={q.label} required={q.required}>
                    {q.type === "checkbox-yn" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                            {["Yes", "No"].map((opt) => (
                                <label key={opt} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        checked={fields[q.key] === opt}
                                        onChange={() => handleChange(q.key, fields[q.key] === opt ? "" : opt)}
                                        style={{ width: 16, height: 16, accentColor: "#5b4bb5", cursor: "pointer" }}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    ) : q.type === "radio-yn" ? (
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
                <button onClick={onBack} style={secondaryBtnStyle}>Back</button>
                <button onClick={onSubmit} style={primaryBtnStyle}>Submit</button>
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
            onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#5b4bb5")}
            onBlur={(e) => (e.currentTarget.style.borderBottomColor = "#c8c7c0")}
        />
    );
}

function UploadCard({
    label,
    required,
    hint,
    files,
    inputRef,
    accept,
    onChange,
}: {
    label: string;
    required?: boolean;
    hint: string;
    files: File[];
    inputRef: React.RefObject<HTMLInputElement | null>;
    accept: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div style={{
            background: "#fff",
            border: "0.5px solid #e0dfd8",
            borderRadius: 12,
            padding: "20px 22px",
        }}>
            <p style={{ fontSize: 14, color: "#1a1a1a", marginBottom: 4 }}>
                {label}
                {required && <span style={{ color: "#d93025", marginLeft: 2 }}>*</span>}
            </p>
            <p style={{ fontSize: 12, color: "#888780", marginBottom: 10 }}>{hint}</p>
            <div style={{
                border: "1.5px dashed #c8c7c0",
                borderRadius: 8,
                padding: "12px 14px",
            }}>
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#5b4bb5",
                        fontSize: 14,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        fontFamily: "inherit",
                    }}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5b4bb5" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Add file
                </button>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={accept}
                    style={{ display: "none" }}
                    onChange={onChange}
                />
                {files.length > 0 && (
                    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                        {files.map((f, i) => (
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
        </div>
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

const secondaryBtnStyle: React.CSSProperties = {
    background: "none",
    color: "#5b4bb5",
    border: "1px solid #5b4bb5",
    borderRadius: 4,
    padding: "10px 28px",
    fontSize: 14,
    fontFamily: "inherit",
    cursor: "pointer",
};