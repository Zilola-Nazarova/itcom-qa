import Link from "next/link";

export default function Nav() {
  return (
    <header>
      <nav>
        <h2>My Profile</h2>
        <Link href="/profile">Profile</Link>
        <Link href="/profile/questions">Questions</Link>
        <Link href="/profile/answers">Answers</Link>
      </nav>
    </header>
  );
}
