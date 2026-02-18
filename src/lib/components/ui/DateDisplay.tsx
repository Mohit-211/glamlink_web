interface DateDisplayProps {
  date: string | Date;
  format?: "short" | "long" | "time";
  className?: string;
}

/**
 * Utility function to format dates consistently across the application
 * @param dateInput - The date string or Date object to format
 * @param format - The format type: short (Feb 2, 2024), long (February 2, 2024), time (includes time)
 * @returns Formatted date string
 */
export function formatDate(dateInput: string | Date, format: "short" | "long" | "time" = "short"): string {
  if (!dateInput) return '';
  
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  // Check for invalid date
  if (isNaN(date.getTime())) return '';
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
  };
  
  if (format === 'time') {
    options.hour = 'numeric';
    options.minute = 'numeric';
  }
  
  return date.toLocaleDateString('en-US', options);
}

/**
 * DateDisplay component for consistent date rendering
 * @param date - The date to display
 * @param format - The format type
 * @param className - Additional CSS classes
 */
export function DateDisplay({ date, format = "short", className = "" }: DateDisplayProps) {
  const formattedDate = formatDate(date, format);
  
  if (!formattedDate) return null;
  
  return (
    <span className={className}>
      {formattedDate}
    </span>
  );
}

/**
 * Formats a date for display in "Member since" contexts
 * @param date - The date to format
 * @returns Formatted string like "January 2024"
 */
export function formatMemberSince(date: string | Date): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
}