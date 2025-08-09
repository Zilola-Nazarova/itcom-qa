'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const router = useRouter();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <>
      <div className="flex items-center justify-center gap-x-8">
        <button
          onClick={() => router.push(createPageURL(currentPage - 1))}
          disabled={currentPage === 1}
          className="bg-neutral-600 px-2 py-1 rounded-md text-neutral-100 disabled:bg-neutral-400 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <p className="text-[1rem] text-neutral-700">
          Page&nbsp;{currentPage} of&nbsp;{totalPages}
        </p>
        <button
          onClick={() => router.push(createPageURL(currentPage + 1))}
          disabled={currentPage === totalPages}
          className="bg-neutral-600 px-2 py-1 rounded-md text-neutral-100 disabled:bg-neutral-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </>
  );
}