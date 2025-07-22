import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET ?? "",
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
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || !profile || !user?.email) {
        console.warn("Missing account, profile, or user email");
        return false;
      }

      if (!process.env.AUTH_SECRET)
        throw new Error("Missing AUTH_SECRET in env");

      const isEmailVerified =
        account.provider === "google"
          ? profile?.email_verified
          : account.provider === "github"
            ? true
            : false;

      if (!isEmailVerified) {
        console.warn("Email not verified. Rejecting sign in.");
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email || "" },
      });

      if (existingUser) {
        const existingAccount = await prisma.account.findFirst({
          where: {
            userId: existingUser.id,
            providerType: account.provider,
          },
        });

        if (!existingAccount) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              providerType: account.type,
              providerId: account.provider,
              providerAccountId: account.providerAccountId,
              accessToken: account.access_token,
              tokenType: account.token_type,
              idToken: account.id_token,
              refreshToken: account.refresh_token,
              accessTokenExpires: account.expires_at
                ? new Date(account.expires_at * 1000)
                : null,
              scope: account.scope,
              sessionState: account.session_state,
            },
          });
        }

        user.id = existingUser.id;
      }

      return true;
    },
  },
});

export { handler as GET, handler as POST };
