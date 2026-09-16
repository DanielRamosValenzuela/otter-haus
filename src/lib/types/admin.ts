export const ACCOUNT_ROLES = ["admin", "sub_admin"] as const;
export type AccountRole = (typeof ACCOUNT_ROLES)[number];

export interface AdminAccount {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: AccountRole;
  active: boolean;
  slug?: string;
  roleTitle?: string;
  photoUrl?: string;
  bio?: string;
  createdAt: string;
}

export type AccountProfile = Pick<
  AdminAccount,
  "id" | "name" | "email" | "role" | "active" | "slug" | "roleTitle" | "photoUrl" | "bio" | "createdAt"
>;

export type SubAdminInput = {
  name: string;
  email: string;
  password: string;
  roleTitle?: string;
};

export type ProfileInput = {
  name: string;
  roleTitle?: string;
  photoUrl?: string;
  bio?: string;
};
