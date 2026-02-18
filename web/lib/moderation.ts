/**
 * Moderation utility: high-risk keywords with weights.
 * risk_score = sum of weights for each keyword found (case-insensitive).
 * If risk_score >= THRESHOLD, comment is held for review (status: 'pending').
 */

export const MODERATION_THRESHOLD = 10;

/** Keyword → weight. Weights are summed when the keyword appears in content. */
const RISK_KEYWORDS: Record<string, number> = {
  // High weight (5–8): clear policy violations
  spam: 8,
  "get rich": 7,
  "click here": 6,
  "free money": 7,
  crypto: 5,
  cryptocurrency: 6,
  "dm me": 6,
  "message me": 5,
  "follow me": 5,
  "subscribe to": 4,
  // Medium weight (3–4)
  scam: 6,
  "make money": 5,
  "earn cash": 5,
  "work from home": 4,
  "passive income": 4,
  "limited offer": 5,
  "act now": 4,
  "buy now": 4,
  "discount code": 3,
  "promo code": 3,
  // Lower weight (1–2): borderline
  link: 1,
  "check out": 2,
  "my channel": 2,
  "my website": 2,
  "my profile": 1,
};

const KEYWORD_ENTRIES = Object.entries(RISK_KEYWORDS).sort(
  (a, b) => b[0].length - a[0].length
);

/**
 * Calculate risk score for a comment.
 * Scans content for RISK_KEYWORDS (case-insensitive) and sums weights.
 * Each keyword is counted at most once (no repeated weighting for same word).
 */
export function calculateRiskScore(content: string): number {
  const lower = content.toLowerCase();
  let score = 0;
  const matched = new Set<string>();

  for (const [keyword, weight] of KEYWORD_ENTRIES) {
    if (matched.has(keyword)) continue;
    if (lower.includes(keyword)) {
      score += weight;
      matched.add(keyword);
    }
  }

  return score;
}

/**
 * Whether the comment should be held for review (pending).
 */
export function shouldHoldForReview(riskScore: number): boolean {
  return riskScore >= MODERATION_THRESHOLD;
}
