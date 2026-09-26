import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#db2777",
          borderRadius: 8,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            fill="#fff"
            d="M9 2 3 6l2 4 2-1.5V21h10V8.5L19 10l2-4-6-4-1.5 2h-3L9 2Z"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
