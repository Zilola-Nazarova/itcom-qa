"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button className="bg-emerald-200 border hover:cursor-pointer" onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
  );
}
