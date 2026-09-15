import "server-only";

/**
 * Google Maps share links (including short links like maps.app.goo.gl) redirect
 * to a URL that encodes the pinned coordinates — either as "@lat,lng,zoom" or,
 * for non-browser clients, "/maps/search/lat,+lng". Following the redirect
 * server-side lets us pull those coordinates out and build a real embeddable
 * map instead of just a plain link.
 */
export async function extractMapsCoordinates(
  url: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const match =
      response.url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ??
      response.url.match(/maps\/search\/(-?\d+\.\d+),\+?(-?\d+\.\d+)/);
    if (!match) return null;
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  } catch {
    return null;
  }
}
