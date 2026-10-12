import { ImageResponse } from "next/og";

export const alt = "SparkV — custom software, AI agents and business automation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#08080a",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 700 }}>
          <div style={{ width: 14, height: 14, borderRadius: 14, background: "#f01822" }} />
          SparkV
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Software that moves businesses forward.
          </div>
          <div style={{ fontSize: 32, color: "#a1a1aa" }}>
            Custom software · AI agents · Business automation
          </div>
        </div>
        <div style={{ fontSize: 26, color: "#f01822" }}>www.sparkv.si</div>
      </div>
    ),
    size,
  );
}
