"use client";

import { FullComment } from "@/types";
import CommentList from "./CommentList";

export default function QuestionCommentsWrapper({
  comments,
}: {
  comments: FullComment[];
}) {
  return <CommentList comments={comments} />;
}
