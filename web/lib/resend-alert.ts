import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Flegm <onboarding@resend.dev>";
const ALERT_EMAIL = process.env.MODERATION_ALERT_EMAIL;

/**
 * Send moderation alert to admin when a comment is held for review.
 */
export async function sendModerationAlert(params: {
  commentContent: string;
  videoPageUrl: string;
  commentId: string;
  authorName?: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!ALERT_EMAIL) {
    console.warn("MODERATION_ALERT_EMAIL not set; skipping alert email");
    return { ok: false, error: "MODERATION_ALERT_EMAIL not configured" };
  }
  if (!process.env.RESEND_API_KEY) {
    return { ok: false, error: "RESEND_API_KEY not set" };
  }

  const { commentContent, videoPageUrl, commentId, authorName } = params;
  const subject = `[Flegm] Comment pending review (risk_score ≥ 10)`;
  const html = `
    <h2>Comment held for moderation</h2>
    <p><strong>Comment ID:</strong> ${commentId}</p>
    ${authorName ? `<p><strong>Author:</strong> ${authorName}</p>` : ""}
    <p><strong>Content:</strong></p>
    <pre style="background:#f4f4f4;padding:12px;border-radius:6px;overflow:auto;">${escapeHtml(commentContent)}</pre>
    <p><a href="${escapeHtml(videoPageUrl)}">Review on video page →</a></p>
  `;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [ALERT_EMAIL],
    subject,
    html,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
