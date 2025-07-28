import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AskQuestionForm from "../components/AskQuestionForm";

export default async function AskPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/signin");
  }

  return (
    <>
      <h2>PROTECTED: Ask a Question</h2>
      <AskQuestionForm />
    </>
  );
}
