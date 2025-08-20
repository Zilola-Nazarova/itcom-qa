"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { RenderTag } from "@/types";

dayjs.extend(relativeTime);

export default function TagsOverview() {
  const [tagsData, setTagsData] = useState<{
    topTags: RenderTag[];
    trendingTags: RenderTag[];
    newTags: RenderTag[];
  }>({ topTags: [], trendingTags: [], newTags: [] });

  useEffect(() => {
    const fetchTags = async () => {
      const res = await fetch("/api/tags/overview");
      const data = await res.json();
      setTagsData(data);
      setLoading(false);
    };
    fetchTags();
  }, []);

  const [loading, setLoading] = useState(true);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <TagSection
        title="🏆 Top Tags"
        tags={tagsData.topTags}
        loading={loading}
        renderTag={(tag) => (
          <TagLink name={tag.name}>
            {tag.name}
            <span className="ml-1 text-sm text-gray-500">
              ({tag.questionCount})
            </span>
          </TagLink>
        )}
      />

      <TagSection
        title="📈 Trending Tags"
        tags={tagsData.trendingTags}
        loading={loading}
        renderTag={(tag) => (
          <TagLink name={tag.name}>
            {tag.name}
            {tag.growth !== undefined && (
              <span className="ml-1 flex items-center text-sm text-green-600">
                <ArrowUp className="h-3 w-3" /> {tag.growth}%
              </span>
            )}
          </TagLink>
        )}
      />

      <TagSection
        title="🆕 New Tags"
        tags={tagsData.newTags}
        loading={loading}
        renderTag={(tag) => (
          <TagLink name={tag.name}>
            {tag.name}
            {tag.createdAt && (
              <span className="ml-1 text-xs text-gray-500">
                {dayjs(tag.createdAt).fromNow()}
              </span>
            )}
          </TagLink>
        )}
      />
    </div>
  );
}

function TagSection({
  title,
  tags,
  loading,
  renderTag,
}: {
  title: string;
  tags: RenderTag[];
  loading: boolean;
  renderTag: (tag: RenderTag) => JSX.Element;
}) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="inline-block h-6 w-20 animate-pulse rounded-full bg-gray-200"
            />
          ))
        ) : tags.length > 0 ? (
          tags.map((tag) => <div key={tag.id}>{renderTag(tag)}</div>)
        ) : (
          <p className="text-sm text-gray-500">No data</p>
        )}
      </div>
    </div>
  );
}

function TagLink({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(name)}`}
      className="inline-flex items-center rounded-full border px-3 py-1 text-sm hover:bg-gray-100"
    >
      {children}
    </Link>
  );
}
