"use client";

import { useState, useRef, useEffect } from "react";
import { COMMENT_LIMITS } from "@/lib/constants";
import { FullComment } from "@/types";

export default function CreateCommentForm({
  questionId,
  answerId,
  onNewComment,
}: {
  questionId: string | null;
  answerId: string | null;
  onNewComment: (comment: FullComment) => void;
}) {
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
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
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
    try {
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
        onNewComment(result);
      } else {
        setErrors({ content: result.message || "Something went wrong." });
      }
    } catch {
      setIsLoading(false);
      setErrors({ content: "Network error. Please try again." });
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
        className="w-full resize-none overflow-hidden rounded-md border p-2 text-sm"
        placeholder="Write your comment..."
      />
      {errors.content && (
        <p className="mt-1 text-xs text-red-500">{errors.content}</p>
      )}

      <div className="mt-2 flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50"
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
          className="rounded-md bg-gray-200 px-3 py-1 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
