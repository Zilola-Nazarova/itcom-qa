"use client";

import { FullComment } from "@/types";
import CommentList from "./CommentList";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CreateCommentForm from "@/app/comments/CreateCommentForm";

export default function QuestionCommentsWrapper({
  questionId,
}: {
  questionId: string;
}) {
  const [comments, setComments] = useState<FullComment[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(`/api/comments/question/${questionId}`);
      const data = await res.json();
      setComments(data);
    };
    fetchComments();
  }, [questionId]);

  const handleNewComment = (newComment: FullComment) => {
    setComments((prev) => [newComment, ...prev]); // prepend new comment
  };

  return (
    <>
      <CommentList comments={comments} />
      {session && (
        <CreateCommentForm
          questionId={questionId}
          answerId={null}
          onNewComment={handleNewComment}
        />
      )}
    </>
  );
}
