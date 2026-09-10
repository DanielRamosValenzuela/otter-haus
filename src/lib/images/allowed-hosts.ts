// Single source of truth for which external image hosts are allowed.
// Consumed by next.config.ts (remotePatterns) and by the property Zod
// schema (src/lib/validation/property-schema.ts), so a mock image URL
// from a blocked host fails with a clear validation error instead of a
// broken next/image request.
export const ALLOWED_IMAGE_HOSTS = [
  "images.unsplash.com",
  "plus.unsplash.com",
  "images.pexels.com",
] as const;

export type AllowedImageHost = (typeof ALLOWED_IMAGE_HOSTS)[number];

export function isAllowedImageUrl(url: string): boolean {
  try {
    const { hostname, protocol } = new URL(url);
    return (
      protocol === "https:" &&
      ALLOWED_IMAGE_HOSTS.includes(hostname as AllowedImageHost)
    );
  } catch {
    return false;
  }
}
