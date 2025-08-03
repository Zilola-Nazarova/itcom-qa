"use client";

import { useState } from "react";
import { createVote } from "@/lib/api";

export default function CreateVote({
  questionId,
  answerId,
  value,
}: {
  questionId: string | null;
  answerId: string | null;
  value: number | null;
}) {

  const [voteStatus, setVoteStatus] = useState<number | null>(value);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ content: string }>({ content: "" });

  const handleThumb = (value: 1 | -1) => {
    setIsLoading(true);
    const newStatus = voteStatus === value ? 0 : value;
    setVoteStatus(newStatus);
    createVote(newStatus, questionId, answerId);
    setIsLoading(false);
  };

  return (
    <div>
      <button
        disabled={isLoading}
        onClick={() => handleThumb(1)}
        style={{ color: voteStatus === 1 ? "blue" : "gray" }}
      >
        {isLoading && <span>Sending...</span>}
        {!isLoading && <span>Like</span>}
      </button>
      <button
        disabled={isLoading}
        onClick={() => handleThumb(-1)}
        style={{ color: voteStatus === -1 ? "blue" : "gray" }}
      >
        {isLoading && <span>Sending...</span>}
        {!isLoading && <span>Dislike</span>}
      </button>
    </div>
  );
}
