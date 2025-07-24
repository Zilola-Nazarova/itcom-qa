"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let message = "Something went wrong. Please try again.";

  switch (error) {
    case "OAuthAccountNotLinked":
      message =
        "This email is already associated with another provider. Please sign in using the original provider (e.g. GitHub).";
      break;
    case "EmailNotVerified":
      const provider = searchParams.get("provider");
      message = `Your email is not verified. Please verify your email with ${provider} before signing in.`;
      break;
    case "MissingData":
      message =
        "We couldn’t retrieve your account details from the provider. Please try again or use a different sign-in method.";
      break;
    default:
      message = "Something went wrong during sign-in. Please try again.";
  }

  return (
    <div>
      <h1>Sign-in Error</h1>
      <p>{message}</p>
      <Link href="/signin">Back to Sign In</Link>
    </div>
  );
}
