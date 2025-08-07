"use client";

import CommentList from "./CommentList";

export default function QuestionCommentsWrapper({ comments }: { comments: any[] }) {
  return <CommentList comments={comments} />;
}
