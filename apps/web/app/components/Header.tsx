import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

import Link from "next/link";
import Image from "next/image";
import Logo from "./itcom-logo.png";

export default async function Header() {
  const session = await getServerSession(authOptions);
  const imageStyle = {
    border: '1px solid #000',
    width: '60px',
    height: 'auto',
  }

  return (
    <header>
      <nav>
        <Image
          style={imageStyle}
          src={Logo}
          alt="IT Community Logo"
          quality={100}
          placeholder="blur"
        />
        <h1 className="bg-lime-200 border">IT Community Q&A Platform</h1>
        {session ? (
          <>
            <Link className="bg-green-200 border" href="/profile">Profile</Link>
            <SignOutButton />
          </>
        ) : (
          <Link href="/signin" className="bg-teal-200 border">Sign In</Link>
        )}
        <Link href="/search" className="bg-cyan-200 border">Search</Link>
        {session && <Link href="/ask" className="bg-sky-200 border">Ask a Question</Link>}
        <Link href="/" className="bg-blue-200 border">Home</Link>
      </nav>
    </header>
  );
}
