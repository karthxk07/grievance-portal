"use client";
import { useFirestore } from "@/hooks/firestore/useFirestore";
import { Grievance } from "@/types/grievance";
import { useState } from "react";
export default function GrievanceCard({
  grievance,
  grievances,
  setGrievances,
  fetchGrievances,
  setFeedbackMessage,
}: {
  grievance: Grievance;
  grievances: Grievance[] | { id: string }[];
  setGrievances: any;
  fetchGrievances: any;
  setFeedbackMessage: any;
}): React.ReactNode {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [message, setMessage] = useState("");
  const grievanceFirestore = useFirestore("grievance");

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
    <div
      key={grievance.id}
      className="mb-6  p-6  border  border-gray-300 rounded-lg"
    >
      <h2 className="text-lg font-medium mb-2 text-stone-800">
        {grievance.title}
      </h2>
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
          className="w-full p-2 mb-4 border text-stone-700 border-gray-200 rounded-lg"
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
          className="w-full p-2 mb-4 border border-gray-300 text-stone-600 rounded-lg"
        />
        <div className="w-full flex justify-end">
          <button
            onClick={() => handleUpdateGrievance(grievance.id)}
            className="w-fit  p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update Grievance
          </button>
        </div>
      </div>
    </div>
  );
}
