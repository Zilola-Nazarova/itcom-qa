import { getQuestion } from "@/lib/api";
import { Question } from "@/lib/db";
import { PageProps } from "@/types";
import CreateAnswerForm from "./answers/create/CreateAnswerForm";
import Votes from "@/app/votes/Votes";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import CreateCommentForm from "@/app/comments/CreateCommentForm";
import QuestionCommentsWrapper from "./QuestionCommentsWrapper";
import AnswerCommentsWrapper from "./AnswerCommentsWrapper";
import Link from "next/link";

export const dynamicParams = true;

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/questions`);
  const questions = await res.json();
  return questions?.data.map((q: Question) => ({ id: q.id }));
}

export default async function QuestionDetails({ params }: PageProps) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  const userId = session?.user.id ?? null;

  const question = await getQuestion(id);

  return (
    <main>
      <nav>
        <h2>Question Details</h2>
      </nav>
      <small>{question.author.name}</small>
      <h3>{question.title}</h3>
      <p>{question.content}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {question.tags.map((tag) => {
          const tagName = tag.name;
          return (
            <Link
              key={tag.id}
              href={`/questions?tags=${encodeURIComponent(tagName)}`}
              className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 transition-colors hover:bg-blue-200"
            >
              {tagName}
            </Link>
          );
        })}
      </div>
      <br />
      <small>
        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
        <span> at {new Date(question.createdAt).toLocaleTimeString()}</span>
      </small>

      <Votes questionId={id} answerId={null} userId={userId} />

      <QuestionCommentsWrapper comments={question.comments} />

      {session && <CreateCommentForm questionId={id} answerId={null} />}

      {session && <CreateAnswerForm questionId={id} />}

      {(!question.answers || question.answers.length === 0) && <p>No answers yet.</p>}

      <ul>
        Answers:
        {question.answers.map(async (answer) => {
          return (
            <li key={answer.id}>
              <p>{answer.content}</p>
              <small>Created by {answer.author.name}</small>
              <br />
              <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
              <span> at {new Date(answer.createdAt).toLocaleTimeString()}</span>

              <Votes questionId={null} answerId={answer.id} userId={userId} />

              <AnswerCommentsWrapper comments={answer.comments} />

              {session && (
                <CreateCommentForm questionId={null} answerId={answer.id} />
              )}
            </li>
          );
        })}
      </ul>

      {session && <CreateAnswerForm questionId={id} />}
    </main>
  );
}
