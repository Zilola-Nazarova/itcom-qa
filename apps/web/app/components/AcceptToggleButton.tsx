"use client"

import { useRouter } from "next/navigation";
import { useTransition } from "react";

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

  const handleToggle = async () => {
    await fetch(`/api/answers/${answerId}/accept`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId }),
    });
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`ml-2 px-2 py-1 text-xs rounded border ${
        isAccepted
          ? "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
          : "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
      }`}
    >
      {isAccepted ? "Unaccept Answer" : "Accept Answer"}
    </button>
  );
}