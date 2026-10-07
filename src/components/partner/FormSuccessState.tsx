import { CheckCircle2 } from "lucide-react";

export default function FormSuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div role="status" className="flex flex-col items-center py-10 text-center sm:py-14">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
      </span>
      <p className="font-display mt-6 max-w-md text-xl sm:text-2xl font-semibold leading-snug text-foreground">
        Thank you for your interest in partnering with Glamlink. Our team will review your
        submission and be in touch if there&apos;s a fit.
      </p>
      <button type="button" onClick={onReset} className="btn-outline mt-8">
        Submit another inquiry
      </button>
    </div>
  );
}
