import type { QuestionWithAuthor } from "@/types";
import Link from "next/link";

type Props = {
  questions: QuestionWithAuthor[];
};

export default function QuestionList({ questions }: Props) {
  return (
    <>
      <ul>
        {questions.map((question: QuestionWithAuthor) => {
          return (
            <li key={question.id}>
              <Link href={`/questions/${question.id}`}>
                <div>
                  <h3>{question.title}</h3>
                  <p>{question.content.slice(0, 20)}...</p>
                  <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                  {' '}
                  <span>{new Date(question.createdAt).toLocaleTimeString()}</span>
                  <br />
                  <span>{question.author.name}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      {questions.length === 0 && <p>There are no questions!</p>}
    </>
  );
}
