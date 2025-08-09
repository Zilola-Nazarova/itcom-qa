'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Tag } from "@/lib/db";

export default function FilterByType() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const res = await fetch('/api/tags');
      const data = await res.json();
      setTags(data);
    };
    fetchTags();
  }, []);

  const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

  const handleTagToggle = (tag: string) => {
    const params = new URLSearchParams(searchParams);

    let updatedTags;
    if (selectedTags.includes(tag)) {
      updatedTags = selectedTags.filter((t) => t !== tag);
    } else {
      updatedTags = [...selectedTags, tag];
    }

    params.set('page', '1');

    if (updatedTags.length > 0) {
      params.set('tags', updatedTags.join(','));
    } else {
      params.delete('tags');
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-neutral-200 border p-2">
      <span className="font-bold">Tags:</span>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <label key={tag.id} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={selectedTags.includes(tag.name)}
              onChange={() => handleTagToggle(tag.name)}
            />
            {tag.name}
          </label>
        ))}
      </div>
    </div>
  );
}