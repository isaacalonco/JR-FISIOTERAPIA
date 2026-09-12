import { getCurrentUserSession } from "@/lib/auth/rbac";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getCurrentUserSession();

  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
