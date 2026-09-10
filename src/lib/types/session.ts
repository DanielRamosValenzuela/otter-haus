export interface SessionData {
  userId?: string;
  email?: string;
  loggedInAt?: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}
