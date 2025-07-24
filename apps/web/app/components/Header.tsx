import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

import Link from "next/link";
import Image from "next/image";
import Logo from "./itcom-logo.png";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header>
      <nav>
        <Image
          src={Logo}
          alt="IT Community Logo"
          width={70}
          quality={100}
          placeholder="blur"
        />
        <h1>IT Community Q&A Platform</h1>
        { session ? (
          <>
            <Link href="/profile">Profile</Link>
            <SignOutButton />
          </>
        ) : (
          <Link href="/signin">Sign In</Link>
        )}
        <Link href="/search">Search</Link>
        { session && <Link href="/ask">Ask a Question</Link> }
        <Link href="/">Home</Link>
      </nav>
    </header>
  );
}
