// app/admin-portal/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useFirestore } from "@/hooks/firestore/useFirestore";
import { Grievance } from "@/types/grievance";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import SignOutButton from "@/components/auth/SignOutButton";

export default function AdminPortal() {
  const grievanceFirestore = useFirestore("grievance");
  const [grievances, setGrievances] = useState<
    Grievance[] | { id: string }[] | null
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [message, setMessage] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

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

  const handleUpdateGrievance = async (grievanceId: string) => {
    try {
      await grievanceFirestore.update(grievanceId, {
        status: selectedStatus,
        adminMessage: message,
      });
      setFeedbackMessage("Grievance updated successfully!");

      // Update local grievances state
      setGrievances(grievances);
      setMessage("");
    } catch (error) {
      console.error("Error updating grievance:", error);
      setFeedbackMessage("Error updating grievance. Please try again.");
    } finally {
      fetchGrievances();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">
        Admin Portal - Grievance Management
      </h1>
      <SignOutButton />
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
        grievances?.map((grievance: any) => (
          <div
            key={grievance.id}
            className="mb-6 p-4 border border-gray-300 rounded-lg"
          >
            <h2 className="text-lg font-medium mb-2">{grievance.title}</h2>
            <p className="text-gray-700 mb-2">{grievance.description}</p>
            <p className="text-gray-500 mb-2">
              <span className="font-semibold">Status:</span> {grievance.status}
            </p>
            <p className="text-gray-500 mb-2">
              <span className="font-semibold">Department:</span>{" "}
              {grievance.department}
            </p>
            <p className="text-gray-500 mb-2">
              <span className="font-semibold">Submitted By:</span>{" "}
              {grievance.isAnonymous ? "Anonymous" : grievance.createdByName}
            </p>

            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-1">
                Update Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              >
                <option value="">Select a status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
              <label className="block text-gray-700 font-medium mb-1">
                Leave a Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              />
              <button
                onClick={() => handleUpdateGrievance(grievance.id)}
                className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update Grievance
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
