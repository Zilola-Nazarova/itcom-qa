import { getQuestion } from "@/lib/api";
import { Question } from "@/lib/db";
import { PageProps } from "@/types";

export const dynamicParams = true;

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/questions`);
  const questions = await res.json();
  return questions.map((q: Question) => ({ id: q.id }));
}

export default async function QuestionDetails({ params }: PageProps) {
  const { id } = await params;
  const question = await getQuestion(id);

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
