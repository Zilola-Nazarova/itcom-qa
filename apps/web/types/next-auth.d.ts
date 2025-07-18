import "next-auth";

declare module "next-auth" {
  interface Profile {
    email_verified?: boolean;
  }
}
