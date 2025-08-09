import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        tags: {
          select: {
            tag: {
              select: { id: true, name: true }
            }
          }
        },
        author: {
          select: { name: true },
        },
        _count: {
          select: {
            comments: true,
            answers: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const voteCounts = await prisma.vote.groupBy({
      by: ["questionId"],
      where: { answerId: null },
      _sum: { value: true },
      _count: {
        _all: true,
      },
    });

    const result = questions.map((q) => {
      const flatTags = q.tags.map(t => t.tag); 
      const voteSummary = voteCounts.find((v) => v.questionId === q.id);
      const upvotes = voteSummary
        ? (voteSummary._count._all + (voteSummary._sum.value ?? 0)) / 2
        : 0;
      const downvotes = voteSummary ? voteSummary._count._all - upvotes : 0;

      return {
        ...q,
        tags: flatTags,
        upvotes,
        downvotes,
      };
    });

    return NextResponse.json(result);
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

    const tags = await Promise.all(
      body.tags.map(async (tagName: string) =>
        prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        })
      )
    );

    const newQuestion = await prisma.question.create({
      data: {
        title: body.title,
        content: body.content,
        author: { connect: { id: session.user.id } },
      },
    });

    await Promise.all(
      tags.map((tag) =>
        prisma.questionTag.create({
          data: {
            questionId: newQuestion.id,
            tagId: tag.id,
          },
        })
      )
    );

    return NextResponse.json(newQuestion);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to post question" },
      { status: 500 }
    );
  }
}
