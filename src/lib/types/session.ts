export interface SessionData {
  userId?: string;
  email?: string;
  loggedInAt?: number;
}

/** Narrow DTO returned by the DAL — never the raw session. */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
}
