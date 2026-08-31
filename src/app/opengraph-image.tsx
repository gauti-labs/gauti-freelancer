import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const runtime = "edge";
export const alt = site.brand;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0a0e1a 0%, #111827 100%)",
          padding: 80,
          position: "relative",
        }}
      >
        {/* Corner brackets */}
        <div style={{ position: "absolute", top: 40, left: 40, width: 40, height: 40, borderTop: "1px solid #E8A800", borderLeft: "1px solid #E8A800", opacity: 0.5 }} />
        <div style={{ position: "absolute", top: 40, right: 40, width: 40, height: 40, borderTop: "1px solid #E8A800", borderRight: "1px solid #E8A800", opacity: 0.5 }} />
        <div style={{ position: "absolute", bottom: 40, left: 40, width: 40, height: 40, borderBottom: "1px solid #E8A800", borderLeft: "1px solid #E8A800", opacity: 0.5 }} />
        <div style={{ position: "absolute", bottom: 40, right: 40, width: 40, height: 40, borderBottom: "1px solid #E8A800", borderRight: "1px solid #E8A800", opacity: 0.5 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 40 }}>
          <div style={{ display: "flex", width: 12, height: 12, borderRadius: 999, background: "#E8A800" }} />
          <span style={{ fontSize: 22, letterSpacing: 6, color: "#E8A800", fontFamily: "monospace", textTransform: "uppercase" }}>
            Digital Architect · India
          </span>
        </div>

        <div style={{ marginTop: 60, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 120,
              fontWeight: 700,
              letterSpacing: -3,
              background: "linear-gradient(180deg, #FFE566 0%, #E8A800 55%, #B8860B 100%)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1,
              fontFamily: "serif",
            }}
          >
            Gautam Goyal
          </div>
          <div style={{ marginTop: 32, fontSize: 44, color: "#F5F1E8", lineHeight: 1.15, maxWidth: 900, fontFamily: "serif", fontWeight: 300 }}>
            I engineer digital products that turn ambitious ideas into reality.
          </div>
        </div>

        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 20, color: "#8B93A7", fontSize: 20 }}>
          <span style={{ fontFamily: "monospace", letterSpacing: 3, textTransform: "uppercase", fontSize: 16, color: "#E8A800" }}>
            Full-Stack · AI · Cloud · Automation
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
