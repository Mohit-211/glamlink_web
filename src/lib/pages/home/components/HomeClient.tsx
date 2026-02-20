"use client";

import TestimonialsSection from "@/lib/pages/home/components/TestimonialsSection";

export default function HomeClient() {
  const handleScheduleClick = () => {
    // TODO: Implement scheduling modal
  };

  return (
    <TestimonialsSection props={{
      state: {
        testimonials: []
      },
      handlers: {
        onScheduleClick: handleScheduleClick
      }
    }} />
  );
} 