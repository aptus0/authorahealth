import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "64px", height: "64px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "18px", background: "#67e8f9", color: "#071019", fontSize: "36px", fontWeight: 800 }}>A</div>,
    size,
  );
}
