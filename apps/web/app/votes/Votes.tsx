"use client";

import { useEffect, useState, useTransition } from "react";
import { createVote, getVotes, getVote } from "@/lib/api";
import { toast } from "sonner";

export default function Votes({
  questionId,
  answerId,
  userId,
}: {
  questionId: string | null;
  answerId: string | null;
  userId: string | null;
}) {
  const [votes, setVotes] = useState({ likes: 0, dislikes: 0 });
  const [userVote, setUserVote] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchData() {
      if ((!questionId && !answerId) || (questionId && answerId)) {
        throw new Error("Must attach vote to either question or answer");
      }

      const [votesData, userVoteData] = await Promise.all([
        getVotes(questionId, answerId),
        userId ? getVote(questionId, answerId, userId) : Promise.resolve(null),
      ]);

      setVotes(votesData);
      setUserVote(userVoteData);
    }

    fetchData();
  }, [questionId, answerId, userId]);

  const handleVote = (newValue: 1 | -1) => {
    const newStatus = userVote === newValue ? 0 : newValue;

    setUserVote(newStatus);
    setVotes((prev) => {
      const delta = newValue === 1 ? "likes" : "dislikes";
      const opposite = newValue === 1 ? "dislikes" : "likes";

      const updated = { ...prev };

      if (userVote === newValue) {
        updated[delta] -= 1;
      } else {
        updated[delta] += 1;
        if (userVote === -newValue) {
          updated[opposite] -= 1;
        }
      }

      return updated;
    });

    startTransition(async () => {
      try {
        await createVote(newStatus, questionId, answerId);
      } catch (error) {
        console.error(error);
        toast.error("Failed to submit vote. Please try again.");
        setUserVote(userVote);
      }
    });
  };

  return (
    <div>
      <div>
        <span>Likes: {votes.likes}</span>
        <span style={{ marginLeft: 8 }}>Dislikes: {votes.dislikes}</span>
      </div>

      {userId && (
        <div>
          <button
            disabled={isPending}
            onClick={() => handleVote(1)}
            style={{
              color: userVote === 1 ? "blue" : "gray",
              opacity: isPending ? 0.5 : 1,
            }}
          >
            Like
          </button>
          <button
            disabled={isPending}
            onClick={() => handleVote(-1)}
            style={{
              color: userVote === -1 ? "blue" : "gray",
              marginLeft: 8,
              opacity: isPending ? 0.5 : 1,
            }}
          >
            Dislike
          </button>
        </div>
      )}
    </div>
  );
}
