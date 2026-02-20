import type { TwoFactorMethod, Session } from './types';

export const TWO_FACTOR_METHODS = [
  {
    id: 'authenticator' as TwoFactorMethod,
    name: 'Authenticator App',
    description: 'Use Google Authenticator, Authy, or similar apps',
    icon: 'Smartphone',
    recommended: true,
  },
  {
    id: 'sms' as TwoFactorMethod,
    name: 'SMS',
    description: 'Receive codes via text message',
    icon: 'MessageSquare',
    recommended: false,
  },
  {
    id: 'email' as TwoFactorMethod,
    name: 'Email',
    description: 'Receive codes via email',
    icon: 'Mail',
    recommended: false,
  },
];

export const DEVICE_ICONS: Record<Session['deviceType'], string> = {
  desktop: 'Monitor',
  mobile: 'Smartphone',
  tablet: 'Tablet',
};

export const BROWSER_ICONS: Record<string, string> = {
  Chrome: 'Chrome',
  Safari: 'Safari',
  Firefox: 'Firefox',
  Edge: 'Edge',
  Opera: 'Opera',
  Other: 'Globe',
};

export const LOGIN_STATUS_COLORS = {
  success: 'text-green-600 bg-green-50 border-green-200',
  failed: 'text-red-600 bg-red-50 border-red-200',
  blocked: 'text-yellow-600 bg-yellow-50 border-yellow-200',
};

export const OAUTH_PROVIDERS = {
  google: {
    name: 'Google',
    icon: 'google',
    color: '#4285F4',
  },
  apple: {
    name: 'Apple',
    icon: 'apple',
    color: '#000000',
  },
  facebook: {
    name: 'Facebook',
    icon: 'facebook',
    color: '#1877F2',
  },
};

// Rate limiting config
export const RATE_LIMIT = {
  MAX_2FA_ATTEMPTS: 5,
  WINDOW_MINUTES: 15,
};

// Session config
export const SESSION_CONFIG = {
  TIMEOUT_DAYS: 30,
  CLEANUP_AFTER_DAYS: 60,
};
