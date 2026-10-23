import { Suspense } from "react";
import type { Metadata } from "next";
import VerifyEmail from "@/components/AuthPage/VerifyEmail";

export const metadata: Metadata = {
  title: "Verify your email",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmail />
    </Suspense>
  );
}
