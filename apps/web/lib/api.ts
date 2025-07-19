import type { QuestionWithAuthor } from "@/types";

export  async function getQuestions(): Promise<QuestionWithAuthor[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/questions`, {
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Unknown error from questions API');
    }

    return res.json();
  } catch (err: any) {
    console.error('Client-side API error in getQuestions():', err.message);
    throw new Error(`Client fetch failed: ${err.message}`);
  }
}