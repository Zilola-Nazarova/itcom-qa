"use client"

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function AcceptToggleButton({
  questionId,
  answerId,
  isAccepted,
}: {
  questionId: string;
  answerId: string;
  isAccepted: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/answers/${answerId}/accept`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId }),
      });

      const result = await res.json();

      if (res.ok) {
        setError(null);
        startTransition(() => {
          router.refresh();
        });
      } else {
        setError(result.message || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isDisabled = loading || isPending;

  return (
    <>
      <button
        onClick={handleToggle}
        disabled={isDisabled}
        className={`ml-2 px-2 py-1 text-xs rounded border ${
          isAccepted
            ? "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
            : "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
        } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading
          ? "Updating..."
          : isAccepted
          ? "Unaccept Answer"
          : "Accept Answer"}
      </button>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </>
  );
}