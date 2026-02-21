import { ImageResponse } from "next/og";

export const alt = "Flegm – The YouTube Leaderboard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(135deg, #f4f4f5 0%, #e4e4e7 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 24,
            background: "#10b981",
            marginBottom: 40,
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "white",
            }}
          >
            F
          </span>
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#09090b",
            letterSpacing: "-0.02em",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          Flegm
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "#71717a",
            marginTop: 12,
            textAlign: "center",
          }}
        >
          The YouTube Leaderboard
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#71717a",
            marginTop: 24,
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          Submit, upvote, and discover the top videos every day.
        </div>
      </div>
    ),
    { ...size }
  );
}
