import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { questionId: string } }
) {
  const session = await getServerSession(authOptions);
  const { questionId } = await params;
  const body = await req.json();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!body?.content) {
    return NextResponse.json({ error: "Empty Content Received" }, { status: 400 });
  }

  try {
    const targetQuestion = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!targetQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const newAnswer = await prisma.answer.create({
      data: {
        content: body.content,
        author: { connect: { id: session.user.id } },
        question: { connect: { id: questionId } },
      },
    });

    return NextResponse.json(newAnswer);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to post answer" },
      { status: 500 }
    );
  }
}
