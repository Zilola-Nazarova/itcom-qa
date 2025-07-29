import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

import Link from "next/link";
import Image from "next/image";
import Logo from "./itcom-logo.png";

export default async function Header() {
  const session = await getServerSession(authOptions);
  const imageStyle = {
    border: "1px solid #000",
    width: "60px",
    height: "auto",
  };

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
        <h1 className="border bg-lime-200">IT Community Q&A Platform</h1>
        {session ? (
          <>
            <Link className="border bg-green-200" href="/profile">
              Profile
            </Link>
            <SignOutButton />
          </>
        ) : (
          <Link href="/signin" className="border bg-teal-200">
            Sign In
          </Link>
        )}
        <Link href="/search" className="border bg-cyan-200">
          Search
        </Link>
        {session && (
          <Link href="/ask" className="border bg-sky-200">
            Ask a Question
          </Link>
        )}
        <Link href="/" className="border bg-blue-200">
          Home
        </Link>
      </nav>
    </header>
  );
}
