"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import type { Tag } from "@/lib/db";

export default function CreateQuestionForm() {
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    title: string;
    content: string;
    tags: string;
  }>({ title: "", content: "", tags: "" });

  useEffect(() => {
    const fetchTags = async () => {
      const res = await fetch('/api/tags');
      const data = await res.json();
      setAllTags(data);
    };
    fetchTags();
  }, []);

  const suggestions = allTags
    .map(t => t.name.toLowerCase())
    .filter(t => t.includes(newTag.toLowerCase()) && !selectedTags.includes(t))
    .slice(0, 8);
    
  const addTag = (tag: string) => {
    const normalized = tag.trim().toLowerCase();
    if (normalized && !selectedTags.includes(normalized)) {
      const updated = [...selectedTags, normalized];
      setSelectedTags(updated);
    }
    console.log(selectedTags)
  };

  const removeTag = (tag: string) => {
    console.log(selectedTags)
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
    console.log(selectedTags)

  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      addTag(newTag);
      setNewTag('');
    }
    // if (e.key === 'Backspace' && !newTag && selectedTags.length) {
    //   e.preventDefault();
    //   removeTag(selectedTags[selectedTags.length - 1]);
    // }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedTags.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tags: "At least one tag is required",
      }));
      return;
    }
    setIsLoading(true);

    const question = { title, content, tags: selectedTags };

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(question),
    });

    const result = await res.json();

    if (res.ok) {
      alert("Question submitted!");
      router.push("/questions");
    } else {
      throw new Error(result.message || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="bg-red-200">
        <span>Title:</span>
        <input
          required
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </label>
      <label className="bg-red-200">
        <span>Content:</span>
        <input
          required
          type="text"
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
      </label>

      <div  className="bg-neutral-200 border p-2 rounded">
        <span className="font-bold">Tags:</span>
        {errors.tags && <p>{errors.tags}</p>}
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
        </div>
        <input
          type="text"
          className="bg-white border rounded px-2 py-1"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type and press space…"
        />
      </div>
      {newTag && suggestions.length > 0 && (
        <ul className="bg-white border rounded mt-1 p-1 max-h-40 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s}
              className="p-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                addTag(s);
                setNewTag('');
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
      <button disabled={isLoading}>
        {isLoading && <span>Sending...</span>}
        {!isLoading && <span>Submit</span>}
      </button>
    </form>
  );
}
