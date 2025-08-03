import VotesCount from "./VotesCount";

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

  return (
    <div>
      {votesCount}
    </div>
  );
}
