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
          background: "linear-gradient(135deg, #faf5ff 0%, #fce7f3 50%, #fffbeb 100%)",
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
            borderRadius: 28,
            background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
            marginBottom: 40,
            boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)",
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "white",
            }}
          >
            F
          </span>
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: "#18181b",
            letterSpacing: "-0.02em",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          flegm
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
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
          Drop, upvote, and discover the top videos every day.
        </div>
      </div>
    ),
    { ...size }
  );
}
