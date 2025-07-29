import type { QuestionWithAuthor, FullQuestion } from "@/types";
import { notFound } from "next/navigation";

export async function getQuestions(): Promise<QuestionWithAuthor[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/questions`, {
    next: { revalidate: 0 },
  });

  return res.json();
}

export async function getQuestion(id: string): Promise<FullQuestion> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/` + id,
    {
      next: { revalidate: 30 },
    }
  );

  if (!res.ok) {
    notFound();
  }

  return res.json();
}
