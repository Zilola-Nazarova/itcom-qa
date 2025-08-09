'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type StatusProps = { value: string; name: string };

const STATUS = [
  { value: 'open', name: 'Open' },
  { value: 'closed', name: 'Closed' },
];

export default function FilterByStatus() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleFilterByStatus = (status: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('status', status);
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