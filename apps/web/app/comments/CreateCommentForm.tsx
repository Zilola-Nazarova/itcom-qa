"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
    if (content.length < 5) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        content: "Your comment is too short.",
      }));
      return;
    } else if (content.length > 500) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        content: "Your comment is too long.",
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
