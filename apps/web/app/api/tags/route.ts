import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: { select: { questions: true } },
      },
      orderBy: {
        questions: { _count: "desc" },
      },
    });
    
    return NextResponse.json(tags);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });  
  }
}
