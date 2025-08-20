"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type OrderByProps = { value: string; name: string };

const ORDER_BY = [
  { value: "lastActivity", name: "Last Activity" },
  { value: "date", name: "Date" },
  { value: "score", name: "Score" },
  { value: "votesCount", name: "Total votes" },
  { value: "answersCount", name: "Answers" },
  { value: "commentsCount", name: "Comments" },
  { value: "likes", name: "Likes" },
  { value: "dislikes", name: "Dislikes" },
];

export default function SortByOrder() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSortByOrder = (orderBy: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("order_by", orderBy);
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <>
      <form className="border bg-neutral-200">
        <select
          className="bg-neutral-100"
          onChange={(e) => handleSortByOrder(e.target.value)}
          defaultValue={searchParams.get("order_by")?.toString()}
        >
          <option value={""} defaultValue={""}>
            Order by:
          </option>
          {ORDER_BY.map((orderBy: OrderByProps, index: number) => (
            <option key={index} value={orderBy.value}>
              {orderBy.name}
            </option>
          ))}
        </select>
      </form>
    </>
  );
}
