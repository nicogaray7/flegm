/** YouTube Shorts: max duration (seconds) to consider as short. Bot and submit use this to exclude shorts. */
export const SHORTS_MAX_DURATION_SECONDS = 180;

/**
 * Extract YouTube video ID from common URL formats.
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
 */
export function extractVideoId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^#&\?\/\s]{11})/,
    /^([^#&\?\/\s]{11})$/, // raw 11-char id
  ];

  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m && m[1].length === 11) return m[1];
  }
  return null;
}

/**
 * Parse ISO 8601 duration (e.g. PT4M13S, PT1H2M10S) to total seconds.
 */
export function parseISODuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export type YouTubeVideoMetadata = {
  title: string;
  duration: number; // seconds
  channelName: string;
  channelId: string;
  channelThumbnail: string | null;
  viewCount: number;
  likeCount: number;
};

/**
 * Fetch video metadata from YouTube Data API v3.
 * Requires YOUTUBE_DATA_API_KEY in env.
 */
export async function fetchVideoMetadata(
  videoId: string,
  apiKey: string
): Promise<YouTubeVideoMetadata | null> {
  const base = "https://www.googleapis.com/youtube/v3";

  const videoRes = await fetch(
    `${base}/videos?id=${encodeURIComponent(videoId)}&part=snippet,contentDetails,statistics&key=${encodeURIComponent(apiKey)}`
  );
  if (!videoRes.ok) return null;
  const videoJson = await videoRes.json();
  const item = videoJson?.items?.[0];
  if (!item) return null;

  const snippet = item.snippet || {};
  const contentDetails = item.contentDetails || {};
  const statistics = item.statistics || {};
  const channelId = snippet.channelId || "";
  const channelTitle = snippet.channelTitle || "";

  let channelThumbnail: string | null = null;
  if (channelId) {
    const channelRes = await fetch(
      `${base}/channels?id=${encodeURIComponent(channelId)}&part=snippet&key=${encodeURIComponent(apiKey)}`
    );
    if (channelRes.ok) {
      const channelJson = await channelRes.json();
      const channelSnippet = channelJson?.items?.[0]?.snippet;
      const thumb = channelSnippet?.thumbnails?.default?.url || channelSnippet?.thumbnails?.medium?.url;
      if (thumb) channelThumbnail = thumb;
    }
  }

  const durationSec = parseISODuration(contentDetails.duration || "PT0S");
  const viewCount = parseInt(statistics.viewCount || "0", 10) || 0;
  const likeCount = parseInt(statistics.likeCount || "0", 10) || 0;

  return {
    title: snippet.title || "",
    duration: durationSec,
    channelName: channelTitle,
    channelId,
    channelThumbnail,
    viewCount,
    likeCount,
  };
}
