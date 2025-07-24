import "next-auth";

declare module "next-auth" {
  interface Profile {
    email_verified?: boolean;
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
