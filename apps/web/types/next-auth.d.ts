import "next-auth";

declare module "next-auth" {
  interface Profile {
    email_verified?: Date | null;
  }

  interface User {
    emailVerified?: Date | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }
}
