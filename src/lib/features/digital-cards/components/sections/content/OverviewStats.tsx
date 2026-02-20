import { Professional } from "@/lib/pages/for-professionals/types/professional";

interface OverviewStatsProps {
  professional: Professional;
}

export default function OverviewStats({ professional }: OverviewStatsProps) {
  const mockPromotions = [
    { id: "promo-1", title: "New Client Special", status: "active" as const },
    { id: "promo-2", title: "Referral Bonus", status: "active" as const }
  ];

  const mockServices = [
    { id: "service-1", name: "Hair Consultation" },
    { id: "service-2", name: "Hair Coloring" },
    { id: "service-3", name: "Hair Styling" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="text-center p-4 bg-glamlink-purple bg-opacity-5 rounded-lg">
        <div className="text-2xl font-bold text-glamlink-purple mb-1">
          {professional.rating?.toFixed(1) || "4.9"}
        </div>
        <div className="text-sm text-gray-600">Client Rating</div>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {(professional.services || mockServices).length}
        </div>
        <div className="text-sm text-gray-600">Services</div>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {(professional.promotions || mockPromotions).length}
        </div>
        <div className="text-sm text-gray-600">Promotions</div>
      </div>
    </div>
  );
}