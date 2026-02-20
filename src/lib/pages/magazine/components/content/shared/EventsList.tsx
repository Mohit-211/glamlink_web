"use client";

import { formatMagazineDate } from "@/lib/pages/admin/utils/dateUtils";
import TypographyWrapper, { TypographySettings } from "../utils/TypographyWrapper";

interface Event {
  title: string;
  titleTypography?: TypographySettings;
  date: string;
  dateTypography?: TypographySettings;
  location: string;
  locationTypography?: TypographySettings;
  description?: string;
  descriptionTypography?: TypographySettings;
  type?: string;
}

interface EventsListProps {
  events: Event[];
  className?: string;
  itemClassName?: string;
  showType?: boolean;
  borderColor?: string;
  title?: string;
  titleTypography?: TypographySettings;
}

export default function EventsList({ 
  events,
  className = "",
  itemClassName = "",
  showType = false,
  borderColor = "border-glamlink-teal",
  title,
  titleTypography = {}
}: EventsListProps) {
  if (!events || events.length === 0) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <TypographyWrapper 
          settings={titleTypography}
          defaultSettings={{
            fontSize: "text-2xl md:text-3xl",
            fontWeight: "font-bold",
            alignment: "left",
            color: "text-gray-900"
          }}
          className="mb-4"
          as="h3"
        >
          {title}
        </TypographyWrapper>
      )}
      {events.map((event, index) => (
        <div 
          key={index} 
          className={`rounded-lg p-6 shadow-sm border-l-4 bg-white ${borderColor} ${itemClassName}`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <TypographyWrapper 
                  settings={event.titleTypography}
                  defaultSettings={{
                    fontSize: "text-lg",
                    fontWeight: "font-bold",
                    color: "text-gray-900"
                  }}
                  as="h4"
                >
                  {event.title}
                </TypographyWrapper>
                {showType && event.type && (
                  <span className="px-2 py-1 bg-glamlink-purple/10 text-glamlink-purple rounded-full text-xs font-medium">
                    {event.type}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <TypographyWrapper 
                  settings={event.dateTypography}
                  defaultSettings={{
                    fontSize: "text-sm",
                    color: "text-gray-600"
                  }}
                  className="flex items-center gap-2"
                  as="p"
                >
                  <span>📅</span>
                  <span>{formatMagazineDate(event.date)}</span>
                </TypographyWrapper>
                <TypographyWrapper 
                  settings={event.locationTypography}
                  defaultSettings={{
                    fontSize: "text-sm",
                    color: "text-gray-600"
                  }}
                  className="flex items-center gap-2"
                  as="p"
                >
                  <span>📍</span>
                  <span>{event.location}</span>
                </TypographyWrapper>
                {event.description && (
                  <TypographyWrapper 
                    settings={event.descriptionTypography}
                    defaultSettings={{
                      fontSize: "text-base",
                      color: "text-gray-700"
                    }}
                    className="mt-2"
                    as="p"
                  >
                    {event.description}
                  </TypographyWrapper>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}