import Link from 'next/link'

export default function Header() {
  return (
    <header>
      <nav>
        <h1>IT Community Q&A Platform</h1>
        <Link href="/signin">Sign In</Link>
        <Link href="/search">Search</Link>
        <Link href="/ask">Ask a Question</Link>
        <Link href="/">Home</Link>
      </nav>
    </header>
  )
}
