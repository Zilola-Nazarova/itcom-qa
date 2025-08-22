"use client";

import { useEffect, useState } from "react";
import { FullComment } from "@/types";
import CommentList from "./CommentList";
import CreateCommentForm from "@/app/comments/CreateCommentForm";
import { useSession } from "next-auth/react";

export default function AnswerCommentsWrapper({ answerId }: { answerId: string }) {
  const [comments, setComments] = useState<FullComment[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(`/api/comments/answer/${answerId}`);
      const data = await res.json();
      setComments(data);
    };
    fetchComments();
  }, [answerId]);

  const handleNewComment = (newComment: FullComment) => {
    setComments((prev) => [newComment, ...prev]); // prepend new comment
  };

  return (
    <>
      <CommentList comments={comments} />
      {session && (
        <CreateCommentForm 
          questionId={null} 
          answerId={answerId} 
          onNewComment={handleNewComment}
        />
      )}
    </>
  );
}