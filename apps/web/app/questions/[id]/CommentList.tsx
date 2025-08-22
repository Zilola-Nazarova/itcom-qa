"use client";

import { FullComment } from "@/types";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function CommentList({ comments }: { comments: FullComment[] }) {
  const [showAll, setShowAll] = useState(false);
  const visibleComments = showAll ? comments : comments.slice(0, 3);

  if (!comments || comments.length === 0) {
    return <p>No comments yet.</p>;
  }

  return (
    <ul>
      Comments:
      {visibleComments.map((comment) => (
        <li key={comment.id}>
          <p>{comment.content}</p>
          <small>Created by {comment.author.name}</small>
          <br />
          {comment.createdAt && (
            <span className="ml-1 text-xs text-gray-500">
              {dayjs(comment.createdAt).fromNow()}
            </span>
          )}
          <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
          <small> at {new Date(comment.createdAt).toLocaleTimeString()}</small>
        </li>
      ))}
      {comments.length > 3 && (
        <button onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
    </ul>
  );
}
