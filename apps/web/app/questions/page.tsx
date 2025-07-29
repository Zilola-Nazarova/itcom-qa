import { getQuestions } from "@/lib/api";

export default async function QuestionsPage() {
  const questions = await getQuestions();

  return (
    <div>
      <nav>
        <h2>Questions</h2>
        <p>
          <small>Currently open questions.</small>
        </p>
      </nav>

      <QuestionList questions={questions} />
    </div>
  );
}
