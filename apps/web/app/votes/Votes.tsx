import CreateVote from "./CreateVote";
import VotesCount from "./VotesCount";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getVote } from "@/lib/api";

export default async function Votes({
  questionId,
  answerId,
}: {
  questionId: string | null;
  answerId: string | null;
}) {
  const votesCount: React.JSX.Element = await VotesCount({
    questionId,
    answerId,
  });

  const session = await getServerSession(authOptions);
  const userVote = await getVote(questionId, answerId, session?.user.id);

  return (
    <div>
      {votesCount}
      {session && (
        <CreateVote
          questionId={questionId}
          answerId={answerId}
          value={userVote}
        />
      )}
    </div>
  );
}
