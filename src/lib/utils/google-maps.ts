import "server-only";

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
    console.log("[maps] resolved url:", response.url, "match:", match);
    if (!match) return null;
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  } catch (error) {
    console.log("[maps] extraction failed:", error);
    return null;
  }
}
