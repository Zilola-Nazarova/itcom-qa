"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [title]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = "auto";
      contentRef.current.style.height = contentRef.current.scrollHeight + "px";
    }
  }, [content]);

  useEffect(() => {
    const fetchTags = async () => {
      const res = await fetch("/api/tags");
      const data = await res.json();
      setAllTags(data);
    };
    fetchTags();
  }, []);

  const suggestions = allTags
    .map((t) => t.name.toLowerCase())
    .filter(
      (t) => t.includes(newTag.toLowerCase()) && !selectedTags.includes(t)
    )
    .slice(0, 8);

  const addTag = (tag: string) => {
    const normalized = tag.trim().toLowerCase();
    if (normalized && !selectedTags.includes(normalized)) {
      const updated = [...selectedTags, normalized];
      setSelectedTags(updated);
    }
  };

  const removeTag = (tag: string) => {
    const updated = selectedTags.filter((t) => t !== tag);
    setSelectedTags(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      addTag(newTag);
      setNewTag("");
    }

    if (e.key === "Backspace" && !newTag && selectedTags.length) {
      e.preventDefault();
      removeTag(selectedTags[selectedTags.length - 1]);
    }
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
      <label className="bg-red-200 block mb-2">
        <span>Title:</span>
        <textarea
          ref={titleRef}
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md p-2 text-sm resize-none overflow-hidden"
          rows={1}
          placeholder="What’s your question in a nutshell?"
        />
      </label>
      <label className="bg-red-200 block mb-2">
        <span>Content:</span>
        <textarea
          ref={contentRef}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded-md p-2 text-sm resize-none overflow-hidden"
          rows={5}
          placeholder="Describe your question in detail..."
        />
      </label>

      <div className="rounded border bg-neutral-200 p-2">
        <span className="font-bold">Tags:</span>
        {errors.tags && <p>{errors.tags}</p>}
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1"
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
          className="rounded border bg-white px-2 py-1"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type and press space…"
        />
      </div>
      {newTag && suggestions.length > 0 && (
        <ul className="mt-1 max-h-40 overflow-y-auto rounded border bg-white p-1">
          {suggestions.map((s) => (
            <li
              key={s}
              className="cursor-pointer p-1 hover:bg-gray-100"
              onClick={() => {
                addTag(s);
                setNewTag("");
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
      <button
        disabled={isLoading}
        className="mt-3 px-3 py-1 bg-blue-600 text-white rounded"
      >
        {isLoading ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}
