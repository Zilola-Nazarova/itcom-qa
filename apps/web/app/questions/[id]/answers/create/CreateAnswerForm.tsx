"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
    if (content.length <= 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        content: "Your answer is too short.",
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
        <span>Answer:</span>
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
