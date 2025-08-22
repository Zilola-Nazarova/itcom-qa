"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ANSWER_LIMITS } from "@/lib/constants";

export default function CreateAnswerForm({
  questionId,
}: {
  questionId: string;
}) {
  const router = useRouter();

  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ content: string }>({ content: "" });
 
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (content.length < ANSWER_LIMITS.MIN) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        content: `Answer must be at least ${ANSWER_LIMITS.MIN} characters.`,
      }));
      return;
    } else if (content.length > ANSWER_LIMITS.MAX) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        content: `Answer must not exceed ${ANSWER_LIMITS.MAX} characters.`,
      }));
      return;
    }
  
    setIsLoading(true);

    const res = await fetch(`/api/answers/${questionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const result = await res.json();

    setIsLoading(false);

    if (res.ok) {
      setContent("");
      setErrors({ content: "" });
      router.refresh();
    } else {
      setErrors({ content: result.message || "Something went wrong." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <textarea
        ref={textareaRef}
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border rounded-md p-2 text-sm resize-none overflow-hidden"
        placeholder="Write your answer..."
      />
      {errors.content && (
        <p className="text-red-500 text-xs mt-1">{errors.content}</p>
      )}
      <div className="mt-2 flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
