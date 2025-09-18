"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Tag } from "@/lib/db";
import { validateQuestion } from "@/lib/validation";

export default function CreateQuestionForm() {
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    general: string | null;
    title: string | null;
    content: string | null;
    tags: string | null;
  }>({ general: null, title: null, content: null, tags: null });

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
    if (!selectedTags.includes(normalized) && normalized) {
      handleQuestionChange("tags", [...selectedTags, normalized]);
    }
  };

  const removeTag = (tag: string) => {
    handleQuestionChange(
      "tags",
      selectedTags.filter((t) => t !== tag)
    );
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

  const handleQuestionChange = (
    field: "title" | "content" | "tags",
    value: string | string[]
  ) => {
    // Обновляем состояние соответствующего поля
    if (field === "title") setTitle(value as string);
    if (field === "content") setContent(value as string);
    if (field === "tags") setSelectedTags(value as string[]);

    // Генерируем объект для валидации
    const questionData = {
      title: field === "title" ? (value as string) : title,
      content: field === "content" ? (value as string) : content,
      tags: field === "tags" ? (value as string[]) : selectedTags,
    };

    // Валидируем и обновляем ошибки
    const validationErrors = validateQuestion(questionData);
    setErrors(validationErrors);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isLoading) return;
  
      const question = { title, content, tags: selectedTags };
      const validationErrors = validateQuestion(question);
      setErrors(validationErrors);
      if (validationErrors.title || validationErrors.content || validationErrors.tags) return;

      setIsLoading(true);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      });
  
      const result = await res.json();
      setIsLoading(false);

      if (res.ok) {
        setErrors({ general: null, title: null, content: null, tags: null });
        router.push("/questions");
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({
            general: result.message || "Something went wrong.",
            title: null,
            content: null,
            tags: null,
          });
        }
      }
    } catch {
      setIsLoading(false);
      setErrors({ general: "Network error. Please try again.", title: null, content: null, tags: null });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="mb-2 block bg-red-200">
        <span>Title:</span>
        <textarea
          ref={titleRef}
          value={title}
          onChange={(e) => handleQuestionChange("title", e.target.value)}
          // onChange={(e) => setTitle(e.target.value)}
          className="w-full resize-none overflow-hidden rounded-md border p-2 text-sm"
          rows={1}
          placeholder="What’s your question in a nutshell?"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title}</p>
        )}
      </label>
      <label className="mb-2 block bg-red-200">
        <span>Content:</span>
        <textarea
          ref={contentRef}
          value={content}
          onChange={(e) => handleQuestionChange("content", e.target.value)}
          // onChange={(e) => setContent(e.target.value)}
          className="w-full resize-none overflow-hidden rounded-md border p-2 text-sm"
          rows={5}
          placeholder="Describe your question in detail..."
        />
        {errors.content && (
          <p className="mt-1 text-xs text-red-500">{errors.content}</p>
        )}
      </label>

      <div className="rounded border bg-neutral-200 p-2">
        <span className="font-bold">Tags:</span>
        {errors.tags && <p className="mt-1 text-xs text-red-500">{errors.tags}</p>}
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
          disabled={
            isLoading ||
            !!errors.title ||
            !!errors.content ||
            !!errors.tags ||
            !title.trim() ||
            !content.trim() ||
            selectedTags.length === 0
          }
          className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50"
      >
        {isLoading ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}
