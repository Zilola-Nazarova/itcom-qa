'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Tag } from "@/lib/db";

export default function FilterByTag() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const res = await fetch('/api/tags');
      const data = await res.json();
      setAllTags(data);
    };
    fetchTags();
  }, []);

  // Initialize from URL on first mount
  useEffect(() => {
    const urlTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    setSelectedTags(urlTags);
  }, []); // only once

  const updateURL  = (updatedTags: string[]) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    if (updatedTags.length > 0) {
      params.set('tags', updatedTags.join(','));
    } else {
      params.delete('tags');
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const addTag = (tag: string) => {
    const normalized = tag.trim().toLowerCase();
    if (normalized && !selectedTags.includes(normalized)) {
      const updated = [...selectedTags, normalized];
      setSelectedTags(updated);
      updateURL([...selectedTags, normalized]);
    }
  };

  const removeTag = (tag: string) => {
    const updated = selectedTags.filter((t) => t !== tag);
    setSelectedTags(updated);
    updateURL(updated); 
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
      setInputValue('');
    }
    if (e.key === 'Backspace' && !inputValue && selectedTags.length) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const suggestions = allTags
    .map(t => t.name.toLowerCase())
    .filter(t => t.includes(inputValue.toLowerCase()) && !selectedTags.includes(t))
    .slice(0, 8);

  return (
    <div className="bg-neutral-200 border p-2 rounded">
      <span className="font-bold">Tags:</span>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              className="text-red-500 hover:text-red-700"
              onClick={() => removeTag(tag)}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          className="bg-white border rounded px-2 py-1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type and press space…"
        />
      </div>
      {inputValue && suggestions.length > 0 && (
        <ul className="bg-white border rounded mt-1 p-1 max-h-40 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s}
              className="p-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                addTag(s);
                setInputValue('');
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}