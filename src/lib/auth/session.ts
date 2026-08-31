import "server-only";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Assert the caller is an admin. Redirects unauthenticated to sign-in and
 * unauthorised to /client. In production this is the only gate admin logic
 * ever crosses — never trust the client.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/signin?callbackUrl=/admin");
  if (session.user.role !== "admin") redirect("/client");
  return session;
}

export async function isAdminSession(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "admin";
}
