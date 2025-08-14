import type { QuestionsList } from "@/types";
import Link from "next/link";
import { getQuestions } from "@/lib/api";

export default async function QuestionList(
  {
    query,
    currentPage,
    orderBy,
    tags,
    status,
    sort,
    limit,
  }: {
    query?: string;
    currentPage?: number;
    orderBy?: string;
    tags?: string[];
    status?: string;
    sort?: string;
    limit?: number;
  }
) {
  const questions = await getQuestions(
    query,
    currentPage,
    orderBy,
    tags,
    status,
    sort,
    limit
  );

  return (
    <>
      <ul className="bg-fuchsia-200">
        {questions?.data.map((question: QuestionsList) => {
          return (
            <li key={question.id} className="bg-pink-200">
              <Link href={`/questions/${question.id}`}>
                <div>
                  <h3>{question.title}</h3>
                  <p>{question.content.slice(0, 20)}...</p>
                  <span>
                    {new Date(question.createdAt).toLocaleDateString()}
                  </span>{" "}
                  <span>
                    {new Date(question.createdAt).toLocaleTimeString()}
                  </span>
                  <br />
                  <span>{question.author.name}</span>
                </div>
              </Link>
              <div>
                <span>Comments: {question._count.comments}</span>
                <span>Answers: {question._count.answers}</span>
                <span>Likes: {question.upvotes}</span>
                <span>Dislikes: {question.downvotes}</span>
              </div>
              <div>
                Tags:
                {question.tags.map((tag) => {
                  return <span key={tag.id}>{tag.name}</span>
                })}
              </div>
            </li>
          );
        })}
      </ul>
      {questions.length === 0 && <p>There are no questions!</p>}
    </>
  );
}
