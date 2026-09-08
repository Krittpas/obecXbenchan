import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/queries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "OBEC × BENCHAMA ESPORTS CHAMPIONSHIP";

/* ใช้ตัวอักษรละตินล้วน เพราะฟอนต์ระบบของ ImageResponse ไม่มีสระ/วรรณยุกต์ไทย */
export default async function Image() {
  const settings = await getSettings();
  const start = new Date(settings.start_at);
  const end = new Date(settings.end_at);
  const range = `${start.getUTCDate() + 0}-${end.getUTCDate()} SEP ${start.getFullYear() + 543}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0C1A44 0%, #14265C 55%, #22429E 100%)",
          color: "#fff",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#EAC463", fontSize: 26 }}>
          <div style={{ width: 44, height: 44, background: "#EAC463" }} />
          OBEC ESPORTS CHAMPIONSHIP
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05, color: "#EAC463" }}>
            OBEC × BENCHAMA
          </div>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>ESPORTS 2569</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, color: "#C9D3EE" }}>
          <span>{range}</span>
          <span>BENCHAMARACHUTHIT CHANTHABURI</span>
        </div>
      </div>
    ),
    size,
  );
}
