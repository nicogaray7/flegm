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
      className={depth > 0 ? "ml-6 mt-3 border-l-2 border-slate-100 pl-4" : "py-3"}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-900">{node.authorName}</p>
            {node.status === "pending" && (
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800">
                Pending review
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-slate-600 whitespace-pre-wrap">
            {node.content}
          </p>
          <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
            <span>{formatDate(node.createdAt)}</span>
            {signedIn && (
              <button
                type="button"
                onClick={() => setShowReply((v) => !v)}
                className="hover:text-emerald-600"
              >
                Reply
              </button>
            )}
          </div>
        </div>
      </div>
      {showReply && (
        <div className="mt-2">
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
    <div className="space-y-0">
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
