import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET ?? "",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: { strategy: "database" },
  pages: {
    signIn: "/signin",
    error: "/auth/error"
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || !profile || !user?.email) {
        console.warn("Sign-in error: Missing account, profile, or user email");
        return '/auth/error?error=MissingData';
      }

      const isEmailVerified =
        account.provider === "google"
          ? profile?.email_verified
          : account.provider === "github"
            ? true
            : false;

      if (!isEmailVerified) {
        console.warn("Sign-in error: Email not verified");
        return `/auth/error?error=EmailNotVerified&provider=${account.provider}`;
      }

      console.log('🔑 user:', user)
      console.log('🔗 account:', account)
      console.log('🧾 profile:', profile)

      if (account.providerAccountId && user.email) {
        console.log(`Successful login via ${account.provider} for ${user.email}`);
      }

      return Promise.resolve(true);
    }
  ,
    async session({ session, user }) {
      console.log("Session callback — user:", user);
      console.log("Session callback — session:", session);
      if (session.user && user.id) {
        session.user.id = user.id;
      }
      return session;
    },
  }
}
