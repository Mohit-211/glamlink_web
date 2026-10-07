"use client";
import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

const inputClass =
  "w-full h-12 px-4 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15";

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block min-w-0">
      <span className="block text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mb-1.5">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </label>
  );
}

export default function NotifySection() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName) return;
    setLoading(true);
    // Simulate API call — wire up your actual endpoint here
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="h-full rounded-2xl border border-border bg-card shadow-soft p-6 sm:p-8">
      {!submitted ? (
        <>
          <p className="text-[10px] uppercase tracking-widest text-primary mb-2">Never miss an episode</p>
          <h3 className="font-display text-2xl leading-snug text-foreground mb-2">
            Get notified when your guest drops
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground mb-6">
            New episodes every Sunday, straight to your inbox. No spam, unsubscribe anytime.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First name" placeholder="Marie" value={firstName} onChange={setFirstName} required />
              <Field label="Last name" placeholder="Matteucci" value={lastName} onChange={setLastName} />
            </div>
            <Field
              label="Email address"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={setEmail}
              required
            />
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-70">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Subscribing…
                </>
              ) : (
                <>
                  Notify me
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-8">
          <div className="w-14 h-14 rounded-full bg-accent text-primary flex items-center justify-center">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-foreground mb-1">
              You&apos;re on the list, {firstName}!
            </p>
            <p className="text-sm text-muted-foreground">
              We&apos;ll let you know the moment a new episode drops.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
