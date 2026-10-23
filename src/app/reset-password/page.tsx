import { Suspense } from "react";
import type { Metadata } from "next";
import ResetPassword from "@/components/AuthPage/ResetPassword";

export const metadata: Metadata = {
  title: "Set your password",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPassword />
    </Suspense>
  );
}
