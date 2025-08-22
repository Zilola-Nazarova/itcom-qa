import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { questionId: string } }
) {
  const { questionId } = await params;

  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        author: { select: { name: true } },
        answers: {
          include: {
            author: { select: { name: true } },
            comments: {
              include: {
                author: { select: { name: true } },
              },
            },
            votes: true,
          },
          orderBy: { votes: { _count: "desc" } },
        },
        comments: {
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
        tags: { select: { tag: { select: { id: true, name: true } } } },
      },
    });

    if (!question) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 500 });
    }

    const tags = question.tags.map((t) => t.tag);

    return NextResponse.json({ ...question, tags });
  } catch (err: unknown) {
    console.error("API Route Error in questions/[id]/route.ts:", err);

    if (err instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to fetch a question (route handler)",
          details: err.message,
        },
        { status: 500 }
      );
    } else {
      console.error("Unexpected error", err);
    }
  }
}
