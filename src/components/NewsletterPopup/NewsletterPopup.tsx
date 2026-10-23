"use client";

import { useEffect, useState } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { subscribeNewsletter } from "@/api/Api";
import { readApiError } from "@/lib/apiError";

interface NewsletterPopupProps {
  openDelay?: number; // milliseconds
}

const NEWSLETTER_COOKIE = "newsletter_popup_seen";
const NEWSLETTER_COOKIE_DAYS = 365;

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

export default function NewsletterPopup({
  openDelay = 30000, // 30 seconds
}: NewsletterPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
  });

  useEffect(() => {
    if (getCookie(NEWSLETTER_COOKIE)) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      setCookie(NEWSLETTER_COOKIE, "true", NEWSLETTER_COOKIE_DAYS);
    }, openDelay);

    return () => clearTimeout(timer);
  }, [openDelay]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const isFormValid = formData.firstName.trim() && formData.email.trim();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubscribe = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await subscribeNewsletter({
        first_name: formData.firstName.trim(),
        email: formData.email.trim(),
        source: "popup",
      });

      try {
        localStorage.setItem("glamlink_newsletter_subscribed", "true");
      } catch {
        // Storage blocked (private mode): the cookie still keeps the popup away
      }

      setSubscribed(true);

      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      toast.error(readApiError(error, "We couldn't subscribe you. Please try again.").message);
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999999]">
      {/* Overlay */}
      <div
        className="absolute inset-0 scrim"
        onClick={isFormValid && !subscribed ? handleClose : undefined}
      />

      {/* Center Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-3xl bg-card shadow-2xl overflow-hidden border border-border/30">
          {/* Background gradient decoration */}

          <div className="relative p-8 md:p-10">
            {
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Close"
                title={!isFormValid ? "Please fill in the form first" : "Close"}
              >
                <X size={20} />
              </button>
            }

            {!subscribed ? (
              <>
                <div className="mb-2">
                  <span className="badge-soft">Subscribe</span>
                </div>

                <h2 className="mb-4 text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                  Stay Ahead in Beauty + Wellness
                </h2>

                <p className="mb-8 text-muted-foreground leading-relaxed text-base">
                  Subscribe for expert insights, treatment trends,
                  business education, industry news and new episodes
                  of The Beauty Vault Podcast.
                </p>

                <form
                  onSubmit={handleSubscribe}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="input-glamlink"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-glamlink"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={18} />
                        Subscribing...
                      </span>
                    ) : (
                      "Subscribe Now"
                    )}
                  </button>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2
                    size={32}
                    className="text-primary"
                  />
                </div>

                <h3 className="mb-3 text-2xl md:text-3xl font-semibold text-foreground">
                  Thank You!
                </h3>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  Thank you for subscribing. You&apos;ll be the first to
                  receive new articles, magazine releases, podcast
                  episodes and industry updates from Glamlink.
                </p>

                <button
                  onClick={handleClose}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}