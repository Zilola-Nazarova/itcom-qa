"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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

  const resource = questionId ? "question" : "answer";
  const resourceId = questionId ? questionId : answerId;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    setContent("");
    if (res.ok) {
      alert("Comment submitted!");
      router.refresh();
    } else {
      throw new Error(result.message || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="bg-red-200">
        <span>Comment:</span>
        {errors.content && <p>{errors.content}</p>}
        <input
          required
          type="text"
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
      </label>

      <button disabled={isLoading}>
        {isLoading && <span>Sending...</span>}
        {!isLoading && <span>Submit</span>}
      </button>
    </form>
  );
}
