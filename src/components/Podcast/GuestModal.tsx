"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
interface Props {
  open: boolean;
  onClose: () => void;
}

export default function GuestModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    website: "",
    instagram: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setForm({ name: "", businessName: "", website: "", instagram: "", email: "", phone: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch(
      "https://node.glamlink.net:5000/api/v1/guest-application/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    if (res.ok) {
      clearForm();
      message.success(data?.message);
      onClose();
    } else {
      message.error(data?.message);
    }
  } catch (err) {
    console.error(err);
    message.error("Server error. Please try again.");
  }

  setLoading(false);
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)" }}
    >
      <div
        className="bg-white w-full relative"
        style={{ maxWidth: 460, borderRadius: 20, overflow: "hidden" }}
      >
        {/* Header */}
        <div className="px-7 pt-7 pb-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p
                className="text-gray-400 font-medium mb-1"
                style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                Be on the show
              </p>
              <h2 className="text-gray-900 font-medium" style={{ fontSize: 22, lineHeight: 1.2 }}>
                Guest application
              </h2>
            </div>
            <button
              onClick={() => { clearForm(); onClose(); }}
              className="flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
              style={{
                width: 32, height: 32, borderRadius: "50%",
                border: "0.5px solid #e5e7eb", fontSize: 13, flexShrink: 0, marginTop: 2,
              }}
            >
              ✕
            </button>
          </div>
          <p className="text-gray-500 mt-2 mb-6" style={{ fontSize: 13, lineHeight: 1.5 }}>
            Tell us about yourself. We'll be in touch if it's a great fit.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 pb-7" style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Row 1: Name + Business */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <FieldLabel>Name *</FieldLabel>
              <input
                name="name"
                placeholder="Jane Smith"
                value={form.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <FieldLabel>Business</FieldLabel>
              <input
                name="businessName"
                placeholder="Acme Inc."
                value={form.businessName}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Row 2: Email + Phone */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <FieldLabel>Email *</FieldLabel>
              <input
                type="email"
                name="email"
                placeholder="jane@acme.com"
                value={form.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <FieldLabel>Phone</FieldLabel>
              <input
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <FieldLabel>Website</FieldLabel>
            <div className="relative">
             
              <input
                name="website"
                placeholder="yourwebsite.com"
                value={form.website}
                onChange={handleChange}
                style={{ ...inputStyle, paddingLeft: 10 }}
              />
            </div>
          </div>

          {/* Instagram */}
          <div>
            <FieldLabel>Instagram</FieldLabel>
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                style={{ fontSize: 13 }}
              >
                @
              </span>
              <input
                name="instagram"
                placeholder="yourhandle"
                value={form.instagram}
                onChange={handleChange}
                style={{ ...inputStyle, paddingLeft: 28 }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2.5 mt-1.5">
            <button
              type="button"
              onClick={clearForm}
              className="text-gray-500 hover:bg-gray-50 transition"
              style={{
                flex: 1, padding: "10px 0", borderRadius: 999,
                border: "0.5px solid #d1d5db", fontSize: 14, background: "transparent",
              }}
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading}
              className="text-white font-medium transition"
              style={{
                flex: 2, padding: "10px 0", borderRadius: 999,
                background: loading ? "hsl(184, 40%, 60%)" : "hsl(184, 70%, 41%)",
                fontSize: 14, border: "none",
              }}
            >
              {loading ? "Submitting…" : "Submit application"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-gray-400 font-medium mb-1.5"
      style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}
    >
      {children}
    </p>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#f9fafb",
  border: "0.5px solid #e5e7eb",
  borderRadius: 8,
  padding: "9px 12px",
  fontSize: 14,
  color: "#111827",
  outline: "none",
};