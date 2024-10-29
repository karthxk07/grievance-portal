"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";

export default function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, checkAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    if (!loading && !user) {
      router.push("/login");
    } else {
      if (user) {
        checkAdmin(user.uid).then((isAdmin) => {
          if (!isAdmin) {
            router.push("/dashboard");
          }
        });
      }
    }
    setLoading(false);
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
