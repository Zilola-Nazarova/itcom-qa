import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const search = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const orderByField = searchParams.get("order_by") || "createdAt";
  const status = searchParams.get("status") || "";
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const sort = searchParams.get("sort") || "desc";
  const tagsParam = searchParams.get("tags");

  const filters = tagsParam ? tagsParam.split(',') : [];

  try {
    const where: any = {
      title: {
        contains: search,
        mode: "insensitive",
      },
      tags: filters.length
        ? undefined
        : undefined,
      AND: [
        ...filters.map(tagName => ({
          tags: { some: { tag: { name: tagName } } }
        }))
      ]
    } 

    const questions = await prisma.question.findMany({
      where,
      orderBy: {
        [orderByField]: sort === "asc" ? "asc" : "desc",
      },
      take: limit,
      skip: (page - 1) * limit,
      include: {
        tags: {
          select: {
            tag: {
              select: { id: true, name: true }
            }
          }
        },
        author: true,
        _count: {
          select: {
            comments: true,
            answers: true,
          },
        },
      },
    });

    const total = await prisma.question.count({
      where
    });

    const voteCounts = await prisma.vote.groupBy({
      by: ["questionId"],
      where: { answerId: null },
      _sum: { value: true },
      _count: { _all: true },
    });

    const questionsWithVotes  = questions.map((q) => {
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

    return NextResponse.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: questionsWithVotes,
    });
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
        authorId: session.user.id,
      },
    });

    await prisma.questionTag.createMany({
      data: tags.map((tag) => ({
        questionId: newQuestion.id,
        tagId: tag.id,
      })),
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
