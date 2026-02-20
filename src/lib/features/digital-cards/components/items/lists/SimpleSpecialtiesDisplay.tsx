"use client";

interface SimpleSpecialtiesDisplayProps {
  specialties?: string[] | string;
}

export default function SimpleSpecialtiesDisplay({ specialties }: SimpleSpecialtiesDisplayProps) {
  // Handle case where specialties might be a string instead of array
  const specialtiesArray = Array.isArray(specialties) ? specialties : (specialties ? [specialties] : []);

  if (specialtiesArray.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-1">
      {specialtiesArray.map((specialty, index) => (
        <li
          key={index}
          className="flex items-center gap-3 text-gray-900"
        >
          <div className="w-2 h-2 bg-glamlink-teal rounded-full flex-shrink-0"></div>
          <span className="font-medium">{specialty}</span>
        </li>
      ))}
    </ul>
  );
}
