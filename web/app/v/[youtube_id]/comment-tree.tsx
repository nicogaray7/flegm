"use client";

import { useState } from "react";
import { CommentForm } from "./comment-form";
import type { CommentNode } from "@/lib/video-page-data";

type Props = {
  youtubeId: string;
  videoUuid: string;
  tree: CommentNode[];
  signedIn: boolean;
};

function formatDate(d: Date) {
  const date = new Date(d);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}h ago`;
  return date.toLocaleDateString();
}

function CommentItem({
  youtubeId,
  videoUuid,
  node,
  signedIn,
  depth,
}: {
  youtubeId: string;
  videoUuid: string;
  node: CommentNode;
  signedIn: boolean;
  depth: number;
}) {
  const [showReply, setShowReply] = useState(false);

  return (
    <div
      className={depth > 0 ? "ml-6 mt-3 border-l-2 border-gray-100 pl-4" : "py-3"}
    >
      <div className="flex items-start gap-3">
        {/* Avatar placeholder */}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
          {node.authorName?.[0]?.toUpperCase() ?? "?"}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">{node.authorName}</p>
            <span className="text-xs text-gray-400">{formatDate(node.createdAt)}</span>
            {node.status === "pending" && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Pending
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
            {node.content}
          </p>
          <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-400">
            {signedIn && (
              <button
                type="button"
                onClick={() => setShowReply((v) => !v)}
                className="font-medium hover:text-emerald-600 transition-colors"
              >
                Reply
              </button>
            )}
          </div>
        </div>
      </div>
      {showReply && (
        <div className="mt-2 ml-10">
          <CommentForm
            youtubeId={youtubeId}
            videoUuid={videoUuid}
            parentId={node.id}
            parentAuthor={node.authorName}
            onCancel={() => setShowReply(false)}
          />
        </div>
      )}
      {node.replies.length > 0 && (
        <div className="mt-1">
          {node.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              youtubeId={youtubeId}
              videoUuid={videoUuid}
              node={reply}
              signedIn={signedIn}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentTree({ youtubeId, videoUuid, tree, signedIn }: Props) {
  return (
    <div className="divide-y divide-gray-100">
      {tree.map((node) => (
        <CommentItem
          key={node.id}
          youtubeId={youtubeId}
          videoUuid={videoUuid}
          node={node}
          signedIn={signedIn}
          depth={0}
        />
      ))}
    </div>
  );
}
