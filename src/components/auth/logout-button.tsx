"use client";

import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/connexion");
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={className}
      onClick={handleLogout}
    >
      <LogOut className={children ? "mr-2 h-5 w-5" : "mr-1.5 h-4 w-4"} />
      {children ?? "Déconnexion"}
    </Button>
  );
}
