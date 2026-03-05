/**
 * Total upvotes to display: real user upvotes + bot-simulated upvotes (for bot-published videos).
 */
export function totalUpvotes(v: {
  upvotesCount: number;
  botUpvotesCount?: number | null;
}): number {
  return v.upvotesCount + (v.botUpvotesCount ?? 0);
}
