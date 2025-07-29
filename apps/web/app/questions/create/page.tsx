import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CreateQuestionForm from "./CreateQuestionForm";

export default async function CreateQuestion() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?message=CanNotAsk&callbackUrl=/questions/create");
  }

  return (
    <main>
      <h2>PROTECTED: Ask a Question</h2>
      <CreateQuestionForm />
    </main>
  );
}
