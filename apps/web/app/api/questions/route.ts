import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
      console.error("Unexpected error", err);
    }
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const newQuestion = await prisma.question.create({
      data: {
        title: body.title,
        content: body.content,
        tags: {
          connectOrCreate: body.tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        author: { connect: { id: session.user.id } },
      },
    });

    return NextResponse.json(newQuestion);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to post question" },
      { status: 500 }
    );
  }
}
