"use client";

import CommentList from "./CommentList";

export default function AnswerCommentsWrapper({ comments }: { comments: any[] }) {
  return <CommentList comments={comments} />;
}
