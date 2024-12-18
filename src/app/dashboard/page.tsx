// app/show-grievance/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useFirestore } from "@/hooks/firestore/useFirestore";
import { Grievance } from "@/types/grievance";
import { useAuth } from "@/hooks/auth/useAuth";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function ShowGrievancePage() {
  const [grievances, setGrievances] = useState<Grievance[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const grievanceFirestore = useFirestore("grievance");
  const auth = useAuth();

  useEffect(() => {
    const fetchGrievance = async () => {
      setLoading(true);
      if (!auth.user) return;
      try {
        const result = await grievanceFirestore.getByField(
          "createdById",
          auth.user?.uid
        );
        if (result.length > 0) {
          setGrievances(result as Grievance[]);
        } else {
          setError("No grievances found for your account.");
        }
      } catch (err) {
        setError("Error fetching grievance. Please try again later.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrievance();
  }, [auth.user]);

  return (
    <>
      <LoadingOverlay isLoading={loading}>
        {error ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-lg mx-auto mt-6"
            role="alert"
          >
            <strong className="font-bold">Oops! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          grievances?.map((grievance: Grievance, idx) => (
            <div
              className="p-6 max-w-full mx-20 flex flex-row justify-between bg-white rounded-lg shadow-md mt-6"
              key={idx}
            >
              <div className="flex flex-col">
                <h1 className="text-2xl text-black font-semibold mb-4">
                  {grievance?.title}
                </h1>
                <p className="mb-2 text-gray-800">
                  <span className="text-primaryMaroon">Status: </span>
                  {grievance?.status.toUpperCase()}
                </p>
                {grievance?.adminMessage && (
                  <p className="mb-2 text-gray-800">
                    <span className="text-darkBlue">Admin Message: </span>
                    {grievance?.adminMessage}
                  </p>
                )}
                <p className="mb-4 text-stone-700">{grievance?.description}</p>
              </div>
              <div className="flex flex-col text-right">
                <p className="text-sm text-gray-500">
                  Created on:{" "}
                  {new Date(grievance?.createdAt || 0).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  {grievance?.isAnonymous
                    ? "Anonymous"
                    : `Submitted by: ${grievance?.createdByName}`}
                </p>
              </div>
            </div>
          ))
        )}
      </LoadingOverlay>
    </>
  );
}
