import QuestionList from "./QuestionList";
import { Suspense } from "react";
import Loading from "../loading";

export default async function QuestionsPage() {
  const questionList: React.JSX.Element = await QuestionList();

  return (
    <div>
      <nav>
        <h2>Questions</h2>
        <p>
          <small>Currently open questions.</small>
        </p>
      </nav>

      <Suspense fallback={<Loading />}>{questionList}</Suspense>
    </div>
  );
}
