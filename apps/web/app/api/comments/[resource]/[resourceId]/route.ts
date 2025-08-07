import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { resourceId: string; resource: string } }
) {
  const { resource, resourceId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  let newComment;

  if (resource === "question") {
    newComment = await prisma.comment.create({
      data: {
        content: body.content,
        author: { connect: { id: session.user.id } },
        question: { connect: { id: resourceId } },
        answer: {},
      },
    });
  } else if (resource === "answer") {
    newComment = await prisma.comment.create({
      data: {
        content: body.content,
        author: { connect: { id: session.user.id } },
        answer: { connect: { id: resourceId } },
        question: {},
      },
    });
  }

  return NextResponse.json(newComment);
}
