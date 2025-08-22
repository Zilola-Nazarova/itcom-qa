"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { COMMENT_LIMITS } from "@/lib/constants";

export default function CreateCommentForm({
  questionId,
  answerId,
}: {
  questionId: string | null;
  answerId: string | null;
}) {
  const router = useRouter();

  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ content: string }>({ content: "" });
  const [isExpanded, setIsExpanded] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resource = questionId ? "question" : "answer";
  const resourceId = questionId ? questionId : answerId;

  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
  
    if (content.length < COMMENT_LIMITS.MIN) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        content: `Comment must be at least ${COMMENT_LIMITS.MIN} characters.`,
      }));
      return;
    } else if (content.length > COMMENT_LIMITS.MAX) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        content: `Comment must not exceed ${COMMENT_LIMITS.MAX} characters.`,
      }));
      return;
    }

    setIsLoading(true);

    const res = await fetch(`/api/comments/${resource}/${resourceId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const result = await res.json();
    setIsLoading(false);

    if (res.ok) {
      setContent("");
      setErrors({ content: "" });
      setIsExpanded(false);
      router.refresh();
    } else {
      setErrors({ content: result.message || "Something went wrong." });
    }
  };

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className="text-sm text-blue-600 hover:underline"
      >
        Add a comment
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <textarea
        ref={textareaRef}
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border rounded-md p-2 text-sm resize-none overflow-hidden"
        placeholder="Write your comment..."
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
        <button
          type="button"
          onClick={() => {
            setIsExpanded(false);
            setContent("");
            setErrors({ content: "" });
          }}
          className="px-3 py-1 bg-gray-200 text-sm rounded-md"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
