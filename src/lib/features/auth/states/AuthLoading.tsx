"use client";

import { ReactNode } from "react";

export interface AuthLoadingProps {
  message?: string;
}

export default function AuthLoading({ message = "Loading..." }: AuthLoadingProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glamlink-teal mx-auto"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}