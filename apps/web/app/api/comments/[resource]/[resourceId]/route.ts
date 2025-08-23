import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { validateComment } from "@/lib/validation";

type CommentRelation =
  | { question: { connect: { id: string } } }
  | { answer: { connect: { id: string } } }
  | object;

export async function POST(
  req: Request,
  { params }: { params: { resourceId: string; resource: string } }
) {
  const { resource, resourceId } = await params;

  const session = await getServerSession(authOptions);
  const body = await req.json();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = body?.content?.trim();
  const error = validateComment({ content });
  if (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }

  try {
    let relation: CommentRelation = {};

    if (resource === "question") {
      const exists = await prisma.question.findUnique({
        where: { id: resourceId },
      });
      if (!exists)
        return NextResponse.json(
          { error: "Question not found" },
          { status: 404 }
        );
      relation = { question: { connect: { id: resourceId } } };
    } else if (resource === "answer") {
      const exists = await prisma.answer.findUnique({
        where: { id: resourceId },
      });
      if (!exists)
        return NextResponse.json(
          { error: "Answer not found" },
          { status: 404 }
        );
      relation = { answer: { connect: { id: resourceId } } };
    } else {
      return NextResponse.json(
        { error: "Invalid resource type" },
        { status: 400 }
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        author: { connect: { id: session.user.id } },
        ...relation,
      },
      include: {
        author: { select: { name: true } },
      },
    });

    return NextResponse.json(newComment);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { resourceId: string; resource: string } }
) {
  const { resource, resourceId } = await params;

  try {
    let where: CommentRelation = {};

    if (resource === "question") {
      const exists = await prisma.question.findUnique({
        where: { id: resourceId },
      });
      if (!exists)
        return NextResponse.json(
          { error: "Question not found" },
          { status: 404 }
        );
      where = { questionId: resourceId };
    } else if (resource === "answer") {
      const exists = await prisma.answer.findUnique({
        where: { id: resourceId },
      });
      if (!exists)
        return NextResponse.json(
          { error: "Answer not found" },
          { status: 404 }
        );
      where = { answerId: resourceId };
    } else {
      return NextResponse.json(
        { error: "Invalid resource type" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where,
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
