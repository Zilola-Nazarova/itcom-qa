import QuestionList from "./QuestionList";
import { Suspense } from "react";
import Loading from "../loading";

export default async function QuestionsPage() {
  return (
    <div>
      <nav>
        <h2>Questions</h2>
        <p>
          <small>Currently open questions.</small>
        </p>
      </nav>

      <Suspense fallback={<Loading />}>
        <QuestionList />
      </Suspense>
    </div>
  );
}
