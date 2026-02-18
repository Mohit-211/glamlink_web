// Redux State Interface
export interface AuthStateInterface {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  requiresPasswordReset: boolean; // True if user needs to change temporary password
}

// User type
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  userType?: 'client' | 'professional' | 'admin';
  emailVerified?: boolean;
}

// Login form data
export interface LoginFormData {
  email: string;
  password: string;
}

// Component Props
export type LoginPageProps = {
  onSuccess?: () => void;
};

// Admin user emails (in production, store this in Firebase)
export const ADMIN_EMAILS = [
  'mohit@blockcod.com',
  'melanie@glamlink.net',
  'admin@glamlink.com',
  'admin@glamlink.net',
];

// Super admin email (has access only to settings)
export const SUPER_ADMIN_EMAIL = 'admin@glamlink.net';