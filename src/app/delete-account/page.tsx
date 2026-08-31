import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquareText, FileText, Mail, Trash2 } from "lucide-react";

/* -------------------------
   Page Metadata
--------------------------*/

export const metadata: Metadata = {
  title: "Delete Your Account",
  description:
    "Instructions on how to request deletion of your Glamlink account and data.",
  alternates: {
    canonical: "https://glamlink.net/delete-account",
  },
};

/* -------------------------
   Steps content
--------------------------*/

const steps = [
  {
    icon: MessageSquareText,
    title: "Go to Contact Us",
    description:
      "Open the Contact Us page from the footer or menu of the Glamlink app or website.",
  },
  {
    icon: FileText,
    title: "Apply for account deletion",
    description:
      'Choose "Account Deletion" as the subject of your message so it reaches the right team.',
  },
  {
    icon: Mail,
    title: "Mention your reason",
    description:
      "Tell us why you'd like to leave. It's optional, but it helps us improve Glamlink for everyone else.",
  },
  {
    icon: Trash2,
    title: "We'll take it from there",
    description:
      "Our team will confirm your request by email, then permanently delete your account and associated data.",
  },
];

/* -------------------------
   Page
--------------------------*/

export default function DeleteAccountPage() {
  return (
    <main className="page-soft">
      <section className="section-glamlink">
        <div className="container-glamlink max-w-3xl">
          <span className="badge-soft mb-6">Account settings</span>

          <h1 className="section-title font-display">
            How to delete your Glamlink account
          </h1>

          <p className="section-subtitle">
            We're sorry to see you go. Deleting your account removes your
            profile, saved data, and access to Glamlink. Follow the steps
            below to submit your request.
          </p>

          <ol className="mt-12 space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="card-glamlink flex gap-5">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Step {index + 1}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">
                      {step.title}
                    </h2>
                    <p className="mt-1 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-12 rounded-2xl border border-border bg-secondary/50 p-6">
            <h3 className="font-semibold">Before you go</h3>
            <p className="mt-2 text-muted-foreground">
              Account deletion is permanent and cannot be undone. This
              includes your profile, bookings, saved professionals, and
              messages. If you'd rather take a break, consider reaching out
              to our team about temporarily deactivating your account
              instead.
            </p>
          </div>

          <div className="mt-10">
            <Link href="/contact-us" className="btn-primary">
              Go to Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
