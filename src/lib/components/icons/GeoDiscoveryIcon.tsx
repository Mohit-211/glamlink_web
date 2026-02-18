export default function GeoDiscoveryIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      {/* Map pin */}
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="3"/>
      
      {/* Radar waves emanating from pin */}
      <path d="M12 14c2.21 0 4-1.79 4-4" strokeDasharray="1 1" opacity="0.8"/>
      <path d="M12 14c3.31 0 6-2.69 6-6" strokeDasharray="1 1" opacity="0.6"/>
      <path d="M12 14c4.42 0 8-3.58 8-8" strokeDasharray="1 1" opacity="0.4"/>
    </svg>
  );
}