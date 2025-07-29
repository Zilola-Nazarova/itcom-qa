import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h2>Home</h2>
      <Link href="/questions">Questions</Link>
    </div>
  );
}
