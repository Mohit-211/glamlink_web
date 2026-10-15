"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

// ─── Input field ──────────────────────────────────────────────────────────────
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
    <label className="block">
      <span className="label-glamlink">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="input-glamlink"
      />
    </label>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NotifySection() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName) return;
    setLoading(true);
    // Simulate API call — wire up your actual endpoint here
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  // Staggered fade-up once the section scrolls into view.
  const fade = (delay: string) =>
    `transition-all duration-700 ease-out ${delay} ${visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`;

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-border bg-muted/40">
      {/* Left brand accent bar */}
      <div className="absolute inset-y-0 left-0 w-1 bg-primary" />

      {/* Large background word */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 select-none pb-2 pr-8 text-[clamp(80px,16vw,180px)] font-semibold leading-[0.9] tracking-tight text-primary/10"
      >
        notify
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-8 py-20 md:px-12">
        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-20">

          {/* LEFT — copy */}
          <div>
            <p className={`${fade("delay-0")} mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary`}>
              <span className="inline-block h-px w-5 bg-primary" />
              Never Miss an Episode
            </p>

            <h2 className={`${fade("delay-100")} mb-6 text-[clamp(34px,5vw,58px)] font-semibold leading-[1.1] tracking-tight md:mb-8`}>
              Get notified
              <br />
              when <span className="text-primary">your guest drops.</span>
            </h2>

            <p className={`${fade("delay-200")} mb-8 max-w-[340px] text-sm leading-relaxed text-muted-foreground`}>
              New episodes every Sunday. Be the first to know when your
              favorite beauty and wellness professional goes live — straight
              to your inbox.
            </p>

            {/* Trust signals */}
            <ul className={`${fade("delay-300")} flex flex-col gap-2.5`}>
              {[
                "No spam, just your episode, your guest, your moment.",
                "Unsubscribe anytime — no hard feelings.",
                "Exclusive early-access drops for subscribers.",
              ].map((text) => (
                <li key={text} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  <span className="text-xs leading-snug text-muted-foreground">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — form */}
          <div className={fade("delay-150")}>
            <div className="rounded-2xl border border-border bg-card p-8 shadow-medium">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="First Name" placeholder="Marie" value={firstName} onChange={setFirstName} required />
                    <Field label="Last Name" placeholder="Matteucci" value={lastName} onChange={setLastName} />
                  </div>
                  <Field
                    label="Email Address"
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={setEmail}
                    required
                  />

                  <button type="submit" disabled={loading} className="btn-primary mt-2 w-full disabled:opacity-70">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Subscribing…
                      </>
                    ) : (
                      <>
                        Notify Me
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-muted-foreground">
                    No spam. Just your episode, your guest, your moment.
                  </p>
                </form>
              ) : (
                /* ── Success state ─────────────────────────────────── */
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary">
                    <Check className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="mb-1 text-lg font-semibold">You&apos;re on the list, {firstName}!</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      We&apos;ll ping you the moment a new episode drops. See you Sunday.
                    </p>
                  </div>
                  <div className="h-px w-full bg-border" />
                  <p className="text-[10px] uppercase tracking-[0.15em] text-primary">✦ New episodes every Sunday</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
