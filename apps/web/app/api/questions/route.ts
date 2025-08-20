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

  const filters = tagsParam ? tagsParam.split(",") : [];

  const now = new Date();

  let statusFilter: any = {};
  switch (status) {
    case "no_answers":
      statusFilter = { answers: { none: {} } };
      break;

    case "no_accepted_answers":
      statusFilter = { answers: { some: {}, every: { isAccepted: false } } };
      break;

    case "has_accepted_answer":
      statusFilter = { answers: { some: { isAccepted: true } } };
      break;

    case "unanswered_recent":
      statusFilter = {
        createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
        answers: { none: {} },
      };
      break;

    case "hot":
      statusFilter = {
        createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
        answers: { some: {} },
      };
      break;
  }

  const where: any = {
    title: { contains: search, mode: "insensitive" },
    AND: [
      ...filters.map((tagName) => ({
        tags: { some: { tag: { name: tagName } } },
      })),
    ],
    ...statusFilter,
  };

  try {
    const questions = await prisma.question.findMany({
      where,
      include: {
        tags: { select: { tag: { select: { id: true, name: true } } } },
        author: true,
        _count: { select: { comments: true, answers: true } },
        votes: true,
        answers: { select: { updatedAt: true } },
        comments: { select: { updatedAt: true } },
      },
    });

    const questionsWithAggregates = questions.map((q) => {
      const flatTags = q.tags.map((t) => t.tag);
      const upvotes = q.votes.filter((v) => v.value > 0).length;
      const downvotes = q.votes.filter((v) => v.value < 0).length;
      const score = upvotes - downvotes;

      const lastActivity = new Date(
        Math.max(
          q.updatedAt.getTime(),
          ...q.answers.map((a) => a.updatedAt.getTime()),
          ...q.comments.map((c) => c.updatedAt.getTime())
        )
      );

      return {
        ...q,
        tags: flatTags,
        upvotes,
        downvotes,
        score,
        answersCount: q._count.answers,
        commentsCount: q._count.comments,
        lastActivity,
      };
    });

    const sortedQuestions = questionsWithAggregates.sort((a, b) => {
      let aVal, bVal;
      switch (orderByField) {
        case "lastActivity":
          aVal = new Date(a.lastActivity).getTime();
          bVal = new Date(b.lastActivity).getTime();
          break;
        case "date":
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case "score":
          aVal = a.score;
          bVal = b.score;
          break;
        case "votesCount":
          aVal = a.upvotes + a.downvotes;
          bVal = b.upvotes + b.downvotes;
          break;
        case "answersCount":
          aVal = a.answersCount;
          bVal = b.answersCount;
          break;
        case "commentsCount":
          aVal = a.commentsCount;
          bVal = b.commentsCount;
          break;
        case "likes":
          aVal = a.upvotes;
          bVal = b.upvotes;
          break;
        case "dislikes":
          aVal = a.downvotes;
          bVal = b.downvotes;
          break;
        default:
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
      }
      return sort === "asc" ? aVal - bVal : bVal - aVal;
    });

    const paginated = sortedQuestions.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      page,
      limit,
      total: questionsWithAggregates.length,
      totalPages: Math.ceil(questionsWithAggregates.length / limit),
      data: paginated,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to post question" },
      { status: 500 }
    );
  }
}
