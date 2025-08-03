import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { resource: string; resourceId: string } }
) {
  const { resource, resourceId } = await params;
  const idKey = resource === "answer" ? "answerId" : "questionId";

  const [likes, dislikes] = await Promise.all([
    prisma.vote.count({
      where: {
        [idKey]: resourceId,
        value: 1,
      },
    }),
    prisma.vote.count({
      where: {
        [idKey]: resourceId,
        value: -1,
      },
    }),
  ]);

  return NextResponse.json({ resourceId, likes, dislikes });
}

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
  const { value } = body;

  if (![1, 0, null, -1].includes(value)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  let existingVote;

  if (resource === "question") {
    existingVote = await prisma.vote.findUnique({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId: resourceId,
        },
      },
    });
  } else if (resource === "answer") {
    existingVote = await prisma.vote.findUnique({
      where: {
        userId_answerId: {
          userId: session.user.id,
          answerId: resourceId,
        },
      },
    });
  }

  if (!existingVote) {
    await prisma.vote.create({
      data: {
        value,
        userId: session.user.id,
        ...(resource === "question" ? { questionId: resourceId } : {}),
        ...(resource === "answer" ? { answerId: resourceId } : {}),
      },
    });
  } else {
    await prisma.vote.update({
      where: { id: existingVote.id },
      data: { value },
    });
  }
  return NextResponse.json({ success: true });
}
