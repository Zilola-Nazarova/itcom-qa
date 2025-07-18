import type { Question } from '@/types/types'

export  async function getQuestions(): Promise<Question[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/questions`, {
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch questions");
  }

  return res.json();
}