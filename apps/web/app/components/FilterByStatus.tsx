'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type StatusProps = { value: string; name: string };

const STATUS = [
  { value: 'no_answers', name: 'No answers' },
  { value: 'no_accepted_answers', name: 'No accepted answers' },
  { value: 'has_accepted_answer	', name: 'Has accepted answer' },
  { value: 'unanswered_recent', name: 'Unanswered (last 24h)' },
  { value: 'hot', name: 'Trending today' },
];

export default function FilterByStatus() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleFilterByStatus = (status: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }

    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <>
      <form className="bg-neutral-200 border">
        <select
          className="bg-neutral-100"
          onChange={(e) => handleFilterByStatus(e.target.value)}
          defaultValue={searchParams.get('status')?.toString()}
        >
          <option value={''} defaultValue={''}>
            Status:
          </option>
          {STATUS.map((status: StatusProps, index) => (
            <option key={index} value={status.value}>
              {status.name}
            </option>
          ))}
        </select>
      </form>
    </>
  );
}