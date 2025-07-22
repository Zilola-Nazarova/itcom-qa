import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(questions);
  } catch (err: unknown) {
    console.error("API Route Error in questions/route.ts:", err);
    if (err instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to fetch questions (route handler)",
          details: err.message,
        },
        { status: 500 }
      );
    } else {
      console.error('Unexpected error', err);
    }
  }
}
