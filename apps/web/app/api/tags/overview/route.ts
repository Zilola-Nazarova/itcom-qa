import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const now = new Date();

const lastWeek = new Date(now);
lastWeek.setDate(lastWeek.getDate() - 7);

const prevWeek = new Date(lastWeek);
prevWeek.setDate(prevWeek.getDate() - 7);

const thirtyDaysAgo = new Date(now);
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

export async function GET() {
  try {
    const [topTags, recent, previous, newTags] = await Promise.all([
      prisma.tag.findMany({
        include: {
          _count: { select: { questions: true } },
        },
        orderBy: {
          questions: { _count: "desc" },
        },
        take: 10,
      }),
      prisma.tag.findMany({
        include: {
          _count: {
            select: {
              questions: {
                where: { question: { createdAt: { gte: lastWeek } } },
              },
            },
          },
        },
      }),
      prisma.tag.findMany({
        include: {
          _count: {
            select: {
              questions: {
                where: {
                  question: { createdAt: { gte: prevWeek, lt: lastWeek } },
                },
              },
            },
          },
        },
      }),
      prisma.tag.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        include: {
          _count: { select: { questions: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    const trendingTags = recent
      .map((tag) => {
        const prevCount =
          previous.find((t) => t.id === tag.id)?._count.questions || 0;
        const currCount = tag._count.questions;
        const growth =
          prevCount === 0 ? currCount : (currCount - prevCount) / prevCount;
        return { ...tag, growth };
      })
      .filter((t) => t.growth > 0)
      .sort((a, b) => b.growth - a.growth)
      .slice(0, 10);

    const topTagsWithCount = topTags.map((tag) => ({
      ...tag,
      questionCount: tag._count.questions,
    }));

    const newTagsWithCount = newTags.map((tag) => ({
      ...tag,
      questionCount: tag._count.questions,
    }));

    return NextResponse.json({
      topTags: topTagsWithCount,
      trendingTags,
      newTags: newTagsWithCount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
