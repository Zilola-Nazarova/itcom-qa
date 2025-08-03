import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
