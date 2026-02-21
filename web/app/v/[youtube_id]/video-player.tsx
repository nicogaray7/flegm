"use client";

import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

type Props = { videoId: string; title: string };

export function VideoPlayer({ videoId, title }: Props) {
  return (
    <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
      <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[var(--surface)]">
        <LiteYouTubeEmbed id={videoId} title={title} />
      </div>
    </div>
  );
}
