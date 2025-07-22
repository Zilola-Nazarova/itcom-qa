import { getQuestion } from "@/lib/api";
import { PageProps } from "@/types";

export default async function QuestionDetails({ params }: PageProps) {
  const question = await getQuestion(params.id);

  return (
    <main>
      <nav>
        <h2>Question Details</h2>
      </nav>
      <h3>{question.content}</h3>
      <small>Created by {question.author.name}</small>
      <ul>
        Answers:
        {question.answers.map((answer) => {
          return <li key={answer.id}>{answer.content}</li>;
        })}
      </ul>
    </main>
  );
}
