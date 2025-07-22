import QuestionList from "./QuestionList";
import { getQuestions } from "@/lib/api";

export default async function QuestionsPage() {
  let questions;

  try {
    questions = await getQuestions();
  } catch (err: any) {
    console.error('Error loading questions page:', err.message);
    return (
      <main className="text-center text-red-500 mt-4">
        Failed to load questions. Please try again later.
      </main>
    );
  }

  return (
    <main>
      <nav>
        <h2>Questions</h2>
        <p><small>Currently open questions.</small></p>
      </nav>

      <QuestionList questions={questions} />
    </main>
  );
}
