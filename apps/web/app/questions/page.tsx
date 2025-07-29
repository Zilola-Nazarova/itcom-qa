import QuestionList from "./QuestionList";
import { getQuestions } from "@/lib/api";

export default async function QuestionsPage() {
  const questions = await getQuestions();

  return (
    <div>
      <nav className="bg-fuchsia-300 p-6">
        <h2>Questions</h2>
        <p>
          <small>Currently open questions.</small>
        </p>
      </nav>

      <QuestionList questions={questions} />
    </div>
  );
}
