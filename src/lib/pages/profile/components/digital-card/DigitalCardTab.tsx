"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/features/auth/useAuth";
import { FormProvider } from "@/lib/pages/admin/components/shared/editing/form/FormProvider";
import { DragPositionProvider } from "@/lib/features/digital-cards/components/editor/shared/DragPositionContext";
import type { Professional } from "@/lib/pages/for-professionals/types/professional";
import { allFields } from "./fieldConfigs";
import DigitalCardEditForm from "./DigitalCardEditForm";
import NoCardLinked from "./NoCardLinked";

export default function DigitalCardTab() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [professional, setProfessional] = useState<Professional | null>(null);

  useEffect(() => {
    const fetchProfessional = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/profile/professional`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setProfessional(data.professional);
        }
      } catch (error) {
        console.error("Error fetching professional:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessional();
  }, [user?.uid]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glamlink-teal"></div>
      </div>
    );
  }

  if (!professional) {
    return <NoCardLinked />;
  }

  return (
    <DragPositionProvider>
      <FormProvider
        initialData={professional as unknown as Record<string, unknown>}
        fields={allFields}
      >
        <DigitalCardEditForm professional={professional} />
      </FormProvider>
    </DragPositionProvider>
  );
}
