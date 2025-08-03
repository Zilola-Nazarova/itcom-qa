import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  {
    params,
  }: { params: { resourceId: string; resource: string; userId: string } }
) {
  const { resourceId, resource, userId } = await params;

  let userVote;

  if (resource === "question") {
    userVote = await prisma.vote.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId: resourceId,
        },
      },
    });
  } else if (resource === "answer") {
    userVote = await prisma.vote.findUnique({
      where: {
        userId_answerId: {
          userId,
          answerId: resourceId,
        },
      },
    });
  }

  if (!userVote) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 500 });
  }

  return NextResponse.json(userVote.value);
}
