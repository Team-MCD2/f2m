import { auth, currentUser } from "@clerk/nextjs/server";

const superAdminEmails = () =>
  (process.env.SUPER_ADMIN_EMAILS ?? "dev@microdidact.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress?.toLowerCase();

  if (email && superAdminEmails().includes(email)) {
    return { userId, role: "admin" as const, email };
  }

  const role = (user?.publicMetadata?.role as string) ?? "admin";

  if (role !== "admin" && role !== "partner") {
    return null;
  }

  return { userId, role, email: user?.emailAddresses[0]?.emailAddress };
}
