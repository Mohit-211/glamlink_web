"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Send } from "lucide-react";

/* -------------------------
   Types & options
--------------------------*/

type ContactFormValues = {
  name: string;
  email: string;
  phone?: string;
  purpose: string;
  description: string;
};

const PURPOSE_OPTIONS = [
  { value: "", label: "Select a reason" },
  { value: "general-enquiry", label: "General enquiry" },
  { value: "support", label: "Help with my account" },
  { value: "partnership", label: "Partnership / business" },
  { value: "feedback", label: "Feedback or suggestion" },
  { value: "report-issue", label: "Report an issue" },
  { value: "account-deletion", label: "Delete my account" },
  { value: "other", label: "Something else" },
];

/* -------------------------
   Page
--------------------------*/

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      purpose: "",
      description: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitError(null);
    try {
      // TODO: point this at your real endpoint (API route, Firebase function, etc.)
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Request failed");

      setSubmitted(true);
      reset();
    } catch {
      setSubmitError(
        "Something went wrong sending your message. Please try again in a moment."
      );
    }
  };

  return (
    <main className="page-soft">
      <section className="section-glamlink">
        <div className="container-glamlink max-w-2xl">
          {submitted ? (
            <div className="card-glamlink flex flex-col items-center text-center py-16">
              <CheckCircle2 className="h-12 w-12 text-primary" />
              <h1 className="mt-6 text-2xl font-semibold font-display">
                Thanks — we've got your message
              </h1>
              <p className="mt-3 text-muted-foreground max-w-md">
                Our team will look into it and reach out to the email you
                gave us shortly.
              </p>
              <button
                className="btn-outline mt-8"
                onClick={() => setSubmitted(false)}
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <span className="badge-soft mb-6">Get in touch</span>
              <h1 className="section-title font-display">Contact us</h1>
              <p className="section-subtitle">
                Have a question, a problem, or want to close your account?
                Tell us what's going on and we'll get back to you.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="card-glamlink mt-10 space-y-6"
                noValidate
              >
                {/* Name */}
                <div>
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                    {...register("name", { required: "Please enter your name" })}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                    {...register("email", {
                      required: "Please enter your email",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone (optional) */}
                <div>
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="For faster follow-up, if you'd like a call"
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                    {...register("phone")}
                  />
                </div>

                {/* Purpose */}
                <div>
                  <label htmlFor="purpose" className="text-sm font-medium">
                    What's this about?
                  </label>
                  <select
                    id="purpose"
                    defaultValue=""
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                    {...register("purpose", {
                      required: "Please choose a reason",
                    })}
                  >
                    {PURPOSE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.purpose && (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors.purpose.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="text-sm font-medium">
                    Tell us more
                  </label>
                  <textarea
                    id="description"
                    rows={5}
                    placeholder="Share as much detail as you can, so our team can help quickly."
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                    {...register("description", {
                      required: "Please add a short description",
                      minLength: {
                        value: 10,
                        message: "A few more details would help us",
                      },
                    })}
                  />
                  {errors.description && (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {submitError && (
                  <p className="text-sm text-destructive">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full sm:w-auto disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Sending..." : "Send message"}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
