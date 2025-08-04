import type { QuestionWithAuthor, FullQuestion, VotesCount } from "@/types";
import { notFound } from "next/navigation";

export async function getQuestions(): Promise<QuestionWithAuthor[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/questions`, {
    next: { revalidate: 0 },
  });

  return res.json();
}

export async function getVote(
  questionId: string | null,
  answerId: string | null,
  userId: string | undefined
): Promise<number | null> {
  const resource = questionId ? "question" : "answer";
  const resourceId = questionId ? questionId : answerId;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/votes/${resource}/${resourceId}/${userId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  return res.json();
}

export async function getVotes(
  questionId: string | null,
  answerId: string | null
): Promise<VotesCount> {
  const resource = questionId ? "question" : "answer";
  const resourceId = questionId ? questionId : answerId;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/votes/${resource}/${resourceId}`,
    {
      next: { revalidate: 0 },
    }
  );

  return res.json();
}

export async function createVote(
  value: number,
  questionId: string | null,
  answerId: string | null
): Promise<VotesCount> {
  const resource = questionId ? "question" : "answer";
  const resourceId = questionId ? questionId : answerId;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/votes/${resource}/${resourceId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    }
  );

  if (!res.ok) {
    throw new Error("createVote api error");
  }

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
