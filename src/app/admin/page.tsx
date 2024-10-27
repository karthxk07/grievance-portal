// app/admin-portal/page.tsx
"use client";
import { useEffect, useState } from "react";
import { Grievance } from "@/types/grievance";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import GrievanceCard from "@/components/admin/GrievanceComponent";

export default function AdminPortal() {
  const [grievances, setGrievances] = useState<
    Grievance[] | { id: string }[] | null
  >([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    setLoading(true);

    try {
      const q = query(
        collection(db, "grievance"),
        where("status", "in", ["pending", "in-progress"])
      );
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoading(false);
      setGrievances(documents);
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
      throw err;
    }
  };

  return (
    <div className="p-6 w-[70%] mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6 text-black">
        Admin Portal - Grievance Management
      </h1>
      {feedbackMessage && (
        <p
          className={`mb-4 text-sm ${
            feedbackMessage.includes("Error")
              ? "text-red-500"
              : "text-green-500"
          }`}
        >
          {feedbackMessage}
        </p>
      )}

      {loading ? (
        <p>Loading grievances...</p>
      ) : grievances?.length === 0 ? (
        <p>No grievances found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-12 ">
          {grievances?.map((grievance: any, idx) => (
            <GrievanceCard
              key={idx}
              grievance={grievance}
              grievances={grievances}
              setGrievances={setGrievances}
              fetchGrievances={fetchGrievances}
              setFeedbackMessage={setFeedbackMessage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
