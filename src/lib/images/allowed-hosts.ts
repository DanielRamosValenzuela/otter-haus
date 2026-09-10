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
