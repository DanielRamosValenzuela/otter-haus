export const ALLOWED_IMAGE_HOSTS = [
  "images.unsplash.com",
  "plus.unsplash.com",
  "images.pexels.com",
] as const;

// Cada Blob store de Vercel tiene un subdominio propio y aleatorio, así que
// se valida por sufijo en vez de una lista de hosts exactos.
export const ALLOWED_IMAGE_HOST_SUFFIX = ".public.blob.vercel-storage.com";

export type AllowedImageHost = (typeof ALLOWED_IMAGE_HOSTS)[number];

export function isAllowedImageUrl(url: string): boolean {
  try {
    const { hostname, protocol } = new URL(url);
    if (protocol !== "https:") return false;
    return (
      ALLOWED_IMAGE_HOSTS.includes(hostname as AllowedImageHost) ||
      hostname.endsWith(ALLOWED_IMAGE_HOST_SUFFIX)
    );
  } catch {
    return false;
  }
}
