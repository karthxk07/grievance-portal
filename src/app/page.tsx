// app/page.tsx
"use client";
import { useAuth } from "@/hooks/auth/useAuth";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function HomePage() {
  const { user, loading, isAdmin } = useAuth();
  const [isAdminStatus, setIsAdminStatus] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading && isAdmin) {
      // Resolve the isAdmin promise and set the admin status
      isAdmin().then((result: any) => {
        setIsAdminStatus(result);
      });
    }
  }, [loading, isAdmin]);

  useEffect(() => {
    if (isAdminStatus === true) {
      redirect("/admin");
    } else if (isAdminStatus === false) {
      redirect("/dashboard");
    }
  }, [isAdminStatus]);

  if (loading || isAdminStatus === null) {
    return <p>Loading...</p>; // Show loading while checking isAdmin
  }

  return null; // Redirects handled, no UI needed here
}
