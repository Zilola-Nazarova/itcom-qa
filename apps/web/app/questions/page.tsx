import QuestionList from "./QuestionList";
import { getQuestions } from "@/lib/api";

export default async function QuestionsPage() {
  let questions;

  try {
    questions = await getQuestions();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error loading questions page:", err.message);
    } else {
      console.error("Unexpected error", err);
    }
    return <main>Failed to load questions. Please try again later.</main>;
  }

  return (
    <main>
      <nav>
        <h2>Questions</h2>
        <p>
          <small>Currently open questions.</small>
        </p>
      </nav>

      <QuestionList questions={questions} />
    </main>
  );
}
