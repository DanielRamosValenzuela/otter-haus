import { ImageResponse } from "next/og";
import { SITE } from "@/lib/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0D12",
          color: "#F5F5F0",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 600,
            letterSpacing: -2,
            display: "flex",
          }}
        >
          TRAN
          <span style={{ color: "#D4AF37" }}>HAUS</span>
        </div>
        <div style={{ fontSize: 32, color: "#9CA3AF", marginTop: 16, display: "flex" }}>
          {SITE.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
