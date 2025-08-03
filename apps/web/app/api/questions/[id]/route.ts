import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        author: { select: { name: true } },
        answers: {
          include: {
            author: { select: { name: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        tags: true,
      },
    });

    if (!question) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 500 });
    }

    return NextResponse.json(question);
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
