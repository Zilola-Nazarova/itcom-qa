import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/signin");
  }

  return (
    <>
      {session.user.image&&<Image
        src={session.user.image}
        alt="User Profile Image"
        height={70}
        width={70}
        quality={100}
      />}
      <h2>{session.user.name}</h2>
      <h3>{session.user.email}</h3>
    </>

  );
}
