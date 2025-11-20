"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // Check if user has required role
  const userRole = session?.user?.role || "USER";
  if (!allowedRoles.includes(userRole)) {
    // Redirect to unauthorized page or home
    router.push("/");
    return null;
  }

  return <>{children}</>;
}