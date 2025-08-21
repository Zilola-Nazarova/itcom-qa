"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

    const answer = { content };

    const res = await fetch(`/api/answers/${questionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answer),
    });

    const result = await res.json();

    setIsLoading(false);
    setContent("");
    if (res.ok) {
      alert("Answer submitted!");
      router.push(`/questions/${questionId}`);
    } else {
      throw new Error(result.message || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="bg-red-200">
        <span>Your Answer:</span>
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
