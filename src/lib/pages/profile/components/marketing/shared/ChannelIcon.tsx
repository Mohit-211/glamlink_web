/**
 * Channel Icon Component
 *
 * Displays an icon for a marketing channel.
 */

'use client';

interface ChannelIconProps {
  channel: string;
  size?: 'sm' | 'md' | 'lg';
}

const CHANNEL_ICONS: Record<string, { bg: string; icon: string }> = {
  'Direct': { bg: 'bg-gray-100', icon: '🔗' },
  'Organic Search': { bg: 'bg-green-100', icon: '🔍' },
  'Paid Search': { bg: 'bg-yellow-100', icon: '💰' },
  'Social Media (Organic)': { bg: 'bg-blue-100', icon: '📱' },
  'Social Media (Paid)': { bg: 'bg-purple-100', icon: '📱' },
  'Email Marketing': { bg: 'bg-green-100', icon: '📧' },
  'Referral': { bg: 'bg-orange-100', icon: '🤝' },
  'Unknown': { bg: 'bg-gray-100', icon: '❓' },
};

export function ChannelIcon({ channel, size = 'md' }: ChannelIconProps) {
  const config = CHANNEL_ICONS[channel] || { bg: 'bg-gray-100', icon: '📊' };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div className={`${config.bg} ${sizeClasses[size]} rounded-lg flex items-center justify-center`}>
      {config.icon}
    </div>
  );
}
