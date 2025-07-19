import type { QuestionWithAuthor } from '@/types'

type Props = {
  questions: QuestionWithAuthor[];
};

export default function QuestionList({ questions }: Props) {
  return (
    <>
      <ul>
        {questions.map((question: QuestionWithAuthor) => {
          console.log(question);
          return (
            <li key={question.id}>
              <div>
                <h3>{question.title}</h3>
                <p>{question.content.slice(0, 20)}...</p>
                <span>{question.createdAt.toLocaleDateString()}</span>
                <br />
                <span>{question.author.name}</span>
              </div>
            </li>
          )
        })}
      </ul>
      {questions.length === 0 && (
        <p>There are no questions!</p>
      )}
    </>
  );
}