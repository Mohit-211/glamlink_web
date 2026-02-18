"use client";

import Image from "next/image";
import MagazineLink from "../../shared/MagazineLink";
import { getImageUrl, getImageObjectFit, getImageObjectPosition } from "@/lib/pages/admin/components/shared/editing/fields/custom/media/imageCropUtils";

interface LocalPro {
  name: string;
  specialty: string;
  image?: any;
  link?: any;
  achievement?: string;
}

interface LocalProsProps {
  pros?: LocalPro[];
  title?: string;
  className?: string;
  backgroundColor?: string;
  gridCols?: 2 | 3 | 4;
}

export default function LocalPros({ 
  pros,
  title = "Top Local Pros",
  className = "",
  backgroundColor = "bg-white",
  gridCols = 3
}: LocalProsProps) {
  if (!pros || pros.length === 0) return null;

  const gridColsClass = 
    gridCols === 2 ? "md:grid-cols-2" :
    gridCols === 4 ? "md:grid-cols-2 lg:grid-cols-4" :
    "md:grid-cols-3";

  return (
    <div className={className}>
      <h3 className="text-2xl font-bold mb-6 text-gray-900">{title}</h3>
      
      <div className={`grid ${gridColsClass} gap-6`}>
        {pros.map((pro, index) => {
          const content = (
            <div className={`rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${backgroundColor}`}>
              {pro.image && (
                <div className="relative aspect-[4/3]">
                  <Image
                    src={getImageUrl(pro.image) || "/images/placeholder.png"}
                    alt={pro.name}
                    fill
                    className={`${getImageObjectFit(pro.image) === "cover" ? "object-cover" : "object-contain"} ${pro.link ? "group-hover:scale-105 transition-transform" : ""}`}
                    style={{
                      objectPosition: getImageObjectPosition(pro.image),
                    }}
                  />
                </div>
              )}
              <div className="p-4">
                <h4 className="font-bold text-lg mb-1">{pro.name}</h4>
                <p className="text-glamlink-teal text-sm mb-2">{pro.specialty}</p>
                {pro.achievement && (
                  <p className="text-xs text-gray-600 italic">"{pro.achievement}"</p>
                )}
              </div>
            </div>
          );

          if (pro.link) {
            return (
              <MagazineLink key={index} field={pro.link} className="group">
                {content}
              </MagazineLink>
            );
          }

          return <div key={index}>{content}</div>;
        })}
      </div>
    </div>
  );
}