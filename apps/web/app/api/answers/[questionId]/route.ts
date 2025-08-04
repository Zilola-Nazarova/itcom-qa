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

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

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
