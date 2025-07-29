"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div>
      <h2>Sign In Page</h2>

      <FaGoogle size={24} />
      <button onClick={() => signIn("google", { callbackUrl })}>
        Sign in with Google
      </button>

      <FaGithub size={24} />
      <button onClick={() => signIn("github", { callbackUrl })}>
        Sign in with GitHub
      </button>

      <p>
        <Link href="/">Back to home</Link>
      </p>
    </div>
  );
}
