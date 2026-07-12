"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";

export default function DashboardRedirectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        const role = user.role;
        if (role === "Supporter") {
          router.replace("/dashboard/supporter");
        } else if (role === "Creator") {
          router.replace("/dashboard/creator");
        } else if (role === "Admin") {
          router.replace("/dashboard/admin");
        } else {
          router.replace("/");
        }
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-zinc-50 dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" color="primary" label="Loading dashboard..." />
      </div>
    </div>
  );
}
