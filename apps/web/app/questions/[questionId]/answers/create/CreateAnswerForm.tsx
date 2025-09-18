"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { validateAnswer } from "@/lib/validation";

export default function CreateAnswerForm({
  questionId,
}: {
  questionId: string;
}) {
  const router = useRouter();

  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ content: string | null }>({
    content: null,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    const error = validateAnswer({ content: value });
    setErrors({ content: error });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    const error = validateAnswer({ content });
    setErrors({ content: error });
    if (error) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/questions/${questionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
  
      const result = await res.json();
      setIsLoading(false);
  
      if (res.ok) {
        setContent("");
        setErrors({ content: null });
        router.refresh();
      } else {
        setErrors({ content: result.message || "Something went wrong." });
      }
    } catch {
      setIsLoading(false);
      setErrors({ content: "Network error. Please try again." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        // onChange={(e) => setContent(e.target.value)}
        className="w-full resize-none overflow-hidden rounded-md border p-2 text-sm"
        placeholder="Write your answer..."
      />
      {errors.content && (
        <p className="mt-1 text-xs text-red-500">{errors.content}</p>
      )}
      <div className="mt-2 flex gap-2">
        <button
          type="submit"
          disabled={isLoading || !!errors.content || !content.trim()}
          className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
