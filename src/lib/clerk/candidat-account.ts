import { clerkClient } from "@clerk/nextjs/server";

export async function banClerkUser(clerkUserId: string): Promise<void> {
  const client = await clerkClient();
  await client.users.banUser(clerkUserId);
}

export async function unbanClerkUser(clerkUserId: string): Promise<void> {
  const client = await clerkClient();
  await client.users.unbanUser(clerkUserId);
}

export async function deleteClerkUser(clerkUserId: string): Promise<void> {
  const client = await clerkClient();
  await client.users.deleteUser(clerkUserId);
}
