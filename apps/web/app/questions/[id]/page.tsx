import { getQuestion } from "@/lib/api";
import { Question } from "@/lib/db";
import { PageProps } from "@/types";
import Votes from "@/app/votes/Votes";

export const dynamicParams = true;

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/questions`);
  const questions = await res.json();
  return questions.map((q: Question) => ({ id: q.id }));
}

export default async function QuestionDetails({ params }: PageProps) {
  const { id } = await params;
  const question = await getQuestion(id);
  const questionVotes: React.JSX.Element = await Votes({
    questionId: id,
    answerId: null,
  });

  return (
    <main>
      <nav>
        <h2>Question Details</h2>
      </nav>
      <h3>{question.content}</h3>
      <small>Created by {question.author.name}</small>
      <br />
      <small>
        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
        <span>
          {" "}
          at
          {new Date(question.createdAt).toLocaleTimeString()}
        </span>
      </small>

      {questionVotes}

      <ul>
        Answers:
        {question.answers.map(async (answer) => {
          const answerVotes: React.JSX.Element = await Votes({
            questionId: null,
            answerId: answer.id,
          });

          return (
            <li key={answer.id}>
              <p>{answer.content}</p>
              <small>Created by {answer.author.name}</small>
              <small>{new Date(answer.createdAt).toLocaleDateString()}</small>
              <small>
                {" "}
                at
                {new Date(answer.createdAt).toLocaleTimeString()}
              </small>
              {answerVotes}
              {answer.comments.map((comment) => {
                return (
                  <li key={comment.id}>
                    <p>{comment.content}</p>
                    <small>Created by {comment.author.name}</small>
                    <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
                    <small>
                      {" "}
                      at
                      {new Date(comment.createdAt).toLocaleTimeString()}
                    </small>
                  </li>
                )
              })}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
