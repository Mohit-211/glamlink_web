"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { apiUrl } from "@/lib/config";

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
      const res = await fetch(apiUrl("guest-application/create"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        clearForm();
        toast.success(data?.message || "Application sent. We'll be in touch.");
        onClose();
      } else {
        toast.error(data?.message || "Could not send your application. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4">
      <div className="relative w-full max-w-[460px] overflow-hidden rounded-2xl bg-card shadow-large">
        {/* Header */}
        <div className="px-7 pt-7">
          <div className="mb-1 flex items-start justify-between">
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">Be on the show</p>
              <h2 className="text-[22px] font-semibold leading-tight text-foreground">Guest application</h2>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => { clearForm(); onClose(); }}
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mb-6 mt-2 text-[13px] leading-normal text-muted-foreground">
            Tell us about yourself. We&apos;ll be in touch if it&apos;s a great fit.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-7 pb-7">
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="label-glamlink">Name *</span>
              <input name="name" placeholder="Jane Smith" value={form.name} onChange={handleChange} required className="input-glamlink" />
            </label>
            <label>
              <span className="label-glamlink">Business</span>
              <input name="businessName" placeholder="Acme Inc." value={form.businessName} onChange={handleChange} className="input-glamlink" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="label-glamlink">Email *</span>
              <input type="email" name="email" placeholder="jane@acme.com" value={form.email} onChange={handleChange} required className="input-glamlink" />
            </label>
            <label>
              <span className="label-glamlink">Phone</span>
              <input name="phone" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange} className="input-glamlink" />
            </label>
          </div>

          <label>
            <span className="label-glamlink">Website</span>
            <input name="website" placeholder="yourwebsite.com" value={form.website} onChange={handleChange} className="input-glamlink" />
          </label>

          <label>
            <span className="label-glamlink">Instagram</span>
            <span className="relative block">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
              <input name="instagram" placeholder="yourhandle" value={form.instagram} onChange={handleChange} className="input-glamlink pl-8" />
            </span>
          </label>

          <div className="mt-2 flex gap-3">
            <button type="button" onClick={clearForm} className="btn-outline flex-1">
              Clear
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-[2] disabled:opacity-70">
              {loading ? "Submitting…" : "Submit application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
