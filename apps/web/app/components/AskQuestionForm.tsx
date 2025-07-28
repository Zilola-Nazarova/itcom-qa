"use client";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(10, "Title too short"),
  content: z.string().min(20, "Content too short"),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required"),
});

type FormData = z.infer<typeof schema>;

export default function AskQuestionForm() {
  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/questions", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (res.ok) {
      alert("Question submitted!");
    } else {
      throw new Error(result.message || "Something went wrong.");
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Please sign in to ask a question.</p>;

  return (
    <form className="flex flex-col gap-2 p-8" onSubmit={handleSubmit(onSubmit)}>
      <input className="bg-red-200 border-2 width-100" {...register("title")} placeholder="Title" />
      {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

      <textarea className="bg-orange-200 border-2" {...register("content")} placeholder="Content" />
      {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}

      <input className="bg-amber-200 border-2" {...register("tags.0")} placeholder="Tag 1" />
      {errors.tags && <p className="text-red-500 text-sm">{errors.tags.message}</p>}

      <button className="bg-yellow-200 border-2" type="submit">Ask</button>
    </form>
  );
}
