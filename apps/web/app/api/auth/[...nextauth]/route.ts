import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import GoogleProvider from 'next-auth/providers/google'

import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "../../../../../../generated/prisma"; // adjust if needed

const prisma = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/signin",
  },
});

export { handler as GET, handler as POST };
