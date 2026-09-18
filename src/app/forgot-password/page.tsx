"use client";

import ForgotPasswordClient from "@/components/Forgotpasswordclient/Forgotpasswordclient";
import React, { Suspense } from "react";

const ForgotPage = () => {
  return (
    <Suspense
      fallback={
        <div className="page-soft flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Loading...
        </div>
      }
    >
      <ForgotPasswordClient />
    </Suspense>
  );
};

export default ForgotPage;