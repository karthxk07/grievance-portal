// app/show-grievance/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useFirestore } from "@/hooks/firestore.ts/useFirestore";
import { Grievance } from "@/types/grievance";
import { useAuth } from "@/hooks/auth/useAuth";
import LoadingOverlay from "@/components/LoadingOverlay";
import { redirect } from "next/navigation";

export default function ShowGrievancePage() {
  const [grievances, setGrievances] = useState<Grievance[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const grievanceFirestore = useFirestore("grievance");
  const auth = useAuth(); // Assumes the URL has the grievance id as a query param

  useEffect(() => {
    auth.isAdmin().then((isAdmin) => {
      {
        isAdmin ? redirect("/admin") : redirect("/dashboard");
      }
    });
  }, [auth]);

  useEffect(() => {
    const fetchGrievance = async () => {
      setLoading(true);
      if (!auth.user) return;
      try {
        const result = await grievanceFirestore.getByField(
          "createdBy",
          auth.user?.uid
        );
        console.log(result);
        if (result) {
          setGrievances(result as any);
        } else {
          setError("Grievance not found.");
        }
      } catch (err) {
        setError("Error fetching grievance.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrievance();
  }, [auth.user]);

  if (error) return <p>{error}</p>;

  return (
    <>
      <LoadingOverlay isLoading={loading}>
        {grievances?.map((grievance: Grievance, idx) => (
          <div
            className="p-6 max-w-lg mx-auto bg-black rounded-lg shadow-md"
            key={idx}
          >
            <h1 className="text-2xl font-semibold mb-4">{grievance?.title}</h1>
            <p className="mb-2 text-gray-600">Status: {grievance?.status}</p>
            <p className="mb-4">{grievance?.description}</p>
            <p className="text-sm text-gray-500">
              Created on:{" "}
              {new Date(grievance?.createdAt || 0).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              {grievance?.isAnonymous
                ? "Anonymous"
                : `Submitted by: ${grievance?.createdBy}`}
            </p>
          </div>
        ))}
      </LoadingOverlay>
    </>
  );
}
