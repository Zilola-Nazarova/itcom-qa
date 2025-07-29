"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tag } from "@/lib/db";

export default function CreateQuestionForm() {
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");
  const [tags, setTags] = useState<string[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addTag = () => {
    if (newTag.trim() !== '') {
      setTags(prevTags => [...prevTags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (name : String) => {
    setTags(prevTags => prevTags.filter(tag => tag !== name));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await new Promise(resolve => setTimeout(resolve, 3000))

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 3000))

    const question = {
      title, content, tags
    }

    const res = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(question),
    });

    const result = await res.json();

    if (res.ok) {
      alert("Question submitted!");
      router.push("/questions")
    } else {
      throw new Error(result.message || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="bg-red-200">
        <span>Title:</span>
        <input
          required
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </label>
      <label className="bg-red-200">
        <span>Content:</span>
        <input
          required
          type="text"
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
      </label>

      <label className="bg-red-200">
        <span>Tags:</span>
        <ul>
          {tags.map(tag => (
            <li key={tag} className="flex justify-between">
              {tag}
              <button onClick={() => removeTag(tag)}>Remove</button>
            </li>
          ))}
        </ul>
        <input
          type="text"
          onChange={(e) => setNewTag(e.target.value)}
          value={newTag}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            addTag();
          }}
        >
          Add Tag
        </button>
      </label>
      <button disabled={isLoading}>
        {isLoading && <span>Sending...</span>}
        {!isLoading && <span>Submit</span>}
      </button>
    </form>
  );
}
