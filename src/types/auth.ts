export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: 'google' | 'password';
  role: UserRole;
}

export interface AuthConfigInfo {
  googleConfigured: boolean;
  adminEmail: string;
  adminPasswordConfigured: boolean;
  callbackUrl: string;
}
