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
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || !profile || !user?.email) {
        console.warn("Sign-in error: Missing account, profile, or user email");
        return "/auth/error?error=MissingData";
      }

      let verifiedEmail: string | undefined = undefined;

      if (account.provider === "google") {
        if (profile.email_verified) verifiedEmail = profile.email;
      }

      if (account.provider === "github") {
        const res = await fetch("https://api.github.com/user/emails", {
          headers: {
            Authorization: `token ${account.access_token}`,
          },
        });

        const emails = await res.json();
        const primary = emails.find((e: any) => e.primary && e.verified);
        if (primary) verifiedEmail = primary.email;
      }

      if (!verifiedEmail) {
        console.warn(
          `Sign-in error: We couldn’t sign you in because your ${account.provider} account doesn’t have a verified email. Please verify your email and try again or use a different provider.`
        );
        return `/auth/error?error=EmailNotVerified&provider=${account.provider}`;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: verifiedEmail },
      });

      if (existingUser && !existingUser.email_verified) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { email_verified: new Date() },
        });
      }

      // DOES NOT WORK
      if (!existingUser) {
        profile.email_verified = new Date();
      }

      console.log("🔑 user:", user);
      console.log("🔗 account:", account);
      console.log("🧾 profile:", profile);

      if (account.providerAccountId && user.email) {
        console.log(
          `Successful login via ${account.provider} for ${user.email}`
        );
      }

      return Promise.resolve(true);
    },
    async session({ session, user }) {
      if (session.user && user.id) {
        session.user.id = user.id;
      }
      console.log("Session callback — user:", user);
      console.log("Session callback — session:", session);
      return session;
    },
  },
};
