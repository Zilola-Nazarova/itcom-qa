import { getVotes } from "@/lib/api";

export default async function VotesCount({
  questionId,
  answerId,
}: {
  questionId: string | null;
  answerId: string | null;
}) {
  if ((!questionId && !answerId) || (questionId && answerId)) {
    throw new Error(
      "Reaction must be attached to either a question or an answer, but not both"
    );
  }

  const votes = await getVotes(questionId, answerId);

  if (votes.resourceId !== (questionId || answerId)) {
    throw new Error(
      "Reaction must be attached to either a question or an answer, but not both"
    );
  }

  return (
    <div>
      <span>Likes: {votes.likes}</span>
      <span>Dislikes: {votes.dislikes}</span>
    </div>
  );
}
