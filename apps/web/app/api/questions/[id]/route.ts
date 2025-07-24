import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const questions = await prisma.question.findUnique({
      where: {
        id: params.id,
      },
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

    return NextResponse.json(questions);
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
