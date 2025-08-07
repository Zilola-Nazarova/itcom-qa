"use client";

import { FullComment } from "@/types";
import CommentList from "./CommentList";

export default function AnswerCommentsWrapper({
  comments,
}: {
  comments: FullComment[];
}) {
  return <CommentList comments={comments} />;
}
