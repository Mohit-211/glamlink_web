"use client";

import { useEffect, useState } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";

interface NewsletterPopupProps {
  openDelay?: number; // milliseconds
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
    const alreadySubscribed = localStorage.getItem(
      "glamlink_newsletter_subscribed"
    );

    if (alreadySubscribed === "true") return;

    const timer = setTimeout(() => {
      setIsOpen(true);
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

      // Replace with your API
      /*
      await subscribeNewsletter({
        first_name: formData.firstName,
        email: formData.email,
      });
      */

      await new Promise((resolve) => setTimeout(resolve, 1500));

      localStorage.setItem(
        "glamlink_newsletter_subscribed",
        "true"
      );

      setSubscribed(true);

      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };
if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[999999]">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={isFormValid && !subscribed ? handleClose : undefined}
      />

      {/* Center Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-3xl bg-card shadow-2xl overflow-hidden border border-border/30">
          {/* Background gradient decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl -z-10" />
          
          <div className="relative p-8 md:p-10">
            {/* {!subscribed && (
              <button
                onClick={handleClose}
                disabled={!isFormValid}
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Close"
                title={!isFormValid ? "Please fill in the form first" : "Close"}
              >
                <X size={20} />
              </button>
            )} */}

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
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-primary hover:opacity-90 px-4 py-3 font-semibold text-primary-foreground transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:shadow-primary/35 active:scale-[0.98]"
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
                  Thank you for subscribing. You'll be the first to
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