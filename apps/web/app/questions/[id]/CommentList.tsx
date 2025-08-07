"use client";

import { FullComment } from "@/types";
import { useState } from "react";

export default function CommentList({ comments }: { comments: FullComment[] }) {
  const [showAll, setShowAll] = useState(false);
  const visibleComments = showAll ? comments : comments.slice(0, 3);

  return (
    <ul>
      Comments:
      {visibleComments.map((comment) => (
        <li key={comment.id}>
          <p>{comment.content}</p>
          <small>Created by {comment.author.name}</small>
          <br />
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
