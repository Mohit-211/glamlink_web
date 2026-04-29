"use client";
import { useEffect, useRef, useState } from "react";

// ─── Floating diamond accent ──────────────────────────────────────────────────
function Diamond({
  style,
  size = 6,
  opacity = 0.18,
}: {
  style?: React.CSSProperties;
  size?: number;
  opacity?: number;
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        background: "hsl(184 55% 42%)",
        opacity,
        transform: "rotate(45deg)",
        borderRadius: 1,
        ...style,
      }}
    />
  );
}

// ─── Animated check icon ──────────────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

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
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative group">
      <label
        className="block text-[9px] tracking-[0.25em] uppercase font-semibold mb-1.5 transition-colors duration-200"
        style={{ color: focused ? "hsl(184 70% 38%)" : "hsl(210 15% 52%)" }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-4 py-3 text-[13px] outline-none transition-all duration-200 rounded-lg"
        style={{
          background: "hsl(0 0% 100%)",
          border: focused
            ? "1.5px solid hsl(184 70% 48%)"
            : "1.5px solid hsl(204 14% 86%)",
          color: "hsl(210 30% 12%)",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          boxShadow: focused
            ? "0 0 0 3px hsl(184 70% 48% / 0.1)"
            : "0 1px 3px hsl(210 20% 10% / 0.05)",
        }}
      />
    </div>
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

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: "hsl(40 30% 97%)",
        fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
      }}
    >
      {/* ── Background grid lines ─────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 79px, hsl(184 20% 88% / 0.4) 79px, hsl(184 20% 88% / 0.4) 80px)",
        }}
      />

      {/* ── Left teal accent bar ──────────────────────────────────────── */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: "linear-gradient(to bottom, hsl(184 70% 48%), hsl(184 50% 36%))" }}
      />

      {/* ── Decorative diamonds ───────────────────────────────────────── */}
      <Diamond style={{ top: 32, left: "42%" }} size={8} opacity={0.12} />
      <Diamond style={{ bottom: 40, left: "28%" }} size={5} opacity={0.1} />
      <Diamond style={{ top: "45%", right: "8%" }} size={10} opacity={0.08} />
      <Diamond style={{ top: 20, right: "35%" }} size={5} opacity={0.1} />

      {/* ── Large background serif word ───────────────────────────────── */}
      <div
        className="absolute right-0 bottom-0 pointer-events-none select-none leading-none"
        aria-hidden
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "clamp(80px, 16vw, 180px)",
          fontWeight: 700,
          color: "hsl(184 30% 88%)",
          opacity: 0.6,
          letterSpacing: "-0.02em",
          lineHeight: 0.9,
          paddingRight: "2rem",
          paddingBottom: "0.5rem",
        }}
      >
        notify
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 md:px-12 py-20">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT — copy */}
          <div>
            <div style={fade(0)}>
              <p
                className="text-[9px] tracking-[0.35em] uppercase font-semibold mb-5 flex items-center gap-2"
                style={{ color: "hsl(184 70% 38%)" }}
              >
                <span
                  className="inline-block w-5 h-px"
                  style={{ background: "hsl(184 70% 48%)" }}
                />
                Never Miss an Episode
              </p>
            </div>

            <div style={fade(100)}>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(34px, 5vw, 58px)",
                  fontWeight: 600,
                  color: "hsl(210 30% 10%)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  marginBottom: "0.2em",
                }}
              >
                Get notified
                <br />
                when
              </h2>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(34px, 5vw, 58px)",
                  fontWeight: 600,
                  fontStyle: "italic",
                  color: "hsl(184 65% 36%)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  marginBottom: "clamp(20px, 3vw, 32px)",
                }}
              >
                your guest drops.
              </h2>
            </div>

            <div style={fade(200)}>
              <p
                className="text-[14px] leading-relaxed mb-8"
                style={{ color: "hsl(210 15% 42%)", maxWidth: 340 }}
              >
                New episodes every Sunday. Be the first to know when your
                favorite beauty and wellness professional goes live — straight
                to your inbox.
              </p>
            </div>

            {/* Trust signals */}
            <div style={fade(280)}>
              <div className="flex flex-col gap-2.5">
                {[
                  "No spam, just your episode, your guest, your moment.",
                  "Unsubscribe anytime — no hard feelings.",
                  "Exclusive early-access drops for subscribers.",
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div
                      className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "hsl(184 70% 94%)" }}
                    >
                      <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                        <path
                          d="M2.5 6l2.5 2.5 4.5-5"
                          stroke="hsl(184 70% 38%)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="text-[12px] leading-snug" style={{ color: "hsl(210 12% 50%)" }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — form */}
          <div style={fade(160)}>
            <div
              className="relative rounded-2xl p-8"
              style={{
                background: "hsl(0 0% 100%)",
                border: "1px solid hsl(204 14% 90%)",
                boxShadow:
                  "0 4px 24px -4px hsl(210 20% 15% / 0.08), 0 1px 4px hsl(210 20% 15% / 0.04)",
              }}
            >
              {/* Card top accent line */}
              <div
                className="absolute top-0 left-8 right-8 h-px rounded-full"
                style={{ background: "linear-gradient(to right, transparent, hsl(184 70% 48%), transparent)" }}
              />

              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="First Name"
                      placeholder="Marie"
                      value={firstName}
                      onChange={setFirstName}
                      required
                    />
                    <Field
                      label="Last Name"
                      placeholder="Matteucci"
                      value={lastName}
                      onChange={setLastName}
                    />
                  </div>
                  <Field
                    label="Email Address"
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={setEmail}
                    required
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full py-3.5 rounded-xl text-[11px] tracking-[0.18em] uppercase font-semibold text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: loading
                        ? "hsl(184 55% 44%)"
                        : "linear-gradient(135deg, hsl(184 70% 41%), hsl(184 55% 36%))",
                      boxShadow: "0 4px 16px hsl(184 70% 41% / 0.35)",
                    }}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="w-3.5 h-3.5 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12" cy="12" r="10"
                            stroke="white" strokeOpacity="0.3" strokeWidth="3"
                          />
                          <path
                            d="M12 2a10 10 0 0 1 10 10"
                            stroke="white" strokeWidth="3" strokeLinecap="round"
                          />
                        </svg>
                        Subscribing…
                      </>
                    ) : (
                      <>
                        Notify Me — GlamLink.net
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p
                    className="text-center text-[10px] tracking-[0.1em]"
                    style={{ color: "hsl(210 12% 62%)" }}
                  >
                    No spam. Just your episode, your guest, your moment.
                  </p>
                </form>
              ) : (
                /* ── Success state ─────────────────────────────────── */
                <div className="flex flex-col items-center text-center py-6 gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "hsl(184 70% 94%)", color: "hsl(184 70% 38%)" }}
                  >
                    <CheckIcon />
                  </div>
                  <div>
                    <p
                      className="font-semibold text-[18px] mb-1"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontStyle: "italic",
                        color: "hsl(210 30% 10%)",
                      }}
                    >
                      You're on the list, {firstName}!
                    </p>
                    <p className="text-[12px] leading-relaxed" style={{ color: "hsl(210 12% 52%)" }}>
                      We'll ping you the moment a new episode drops. See you Sunday.
                    </p>
                  </div>
                  <div
                    className="w-full h-px"
                    style={{ background: "hsl(204 14% 92%)" }}
                  />
                  <p
                    className="text-[10px] tracking-[0.15em] uppercase"
                    style={{ color: "hsl(184 55% 48%)" }}
                  >
                    ✦ New episodes every Sunday
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}