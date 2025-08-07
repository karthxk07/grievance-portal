// app/submit-grievance/page.tsx
"use client"; // app/submit-grievance/page.tsx

import { useEffect, useState } from "react";
import { useFirestore } from "@/hooks/firestore/useFirestore";
import { useAuth } from "@/hooks/auth/useAuth";
import LoadingOverlay from "@/components/LoadingOverlay";

// List of available departments
const departments = [
"Hr", 
"finance", 
"BA", 
"marketing",
"academics", 
"hostel", 
"registrars office", 
"directors office",
"others"
];

export default function SubmitGrievancePage() {
  const { user } = useAuth();
  const grievanceFirestore = useFirestore("grievance");
  const usersFirestore = useFirestore("users");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");
  const [department, setDepartment] = useState(departments[0]); // Default to the first department
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    if (!user) return;
    usersFirestore
      .getById(user?.uid)
      .then((user) => {
        setUsername(user?.name);
      })
      .then(() => {
        setLoading(false);
      });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await grievanceFirestore.add({
        title,
        description,
        department,
        status: "pending",
        createdAt: Date.now(),
        createdById: isAnonymous ? "Anonymous" : user?.uid || "Unknown",
        createdByName: isAnonymous ? "Anonymous" : username || "Unknown",
        isAnonymous,
      });

      setMessage("Grievance submitted successfully!");
      setTitle("");
      setDescription("");
      setDepartment(departments[0]);
      setIsAnonymous(false);
    } catch (error) {
      setMessage("Error submitting grievance. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingOverlay isLoading={loading}>
      <div className="absolute inset-0 top-1/2 -translate-y-1/2 p-6 h-fit max-w-md mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-black">
          Submit a Grievance
        </h1>
        {message && (
          <p
            className={`mb-4 text-sm ${
              message.includes("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-500 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 text-stone-700 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-500 font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 text-stone-700 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-500 font-medium mb-2">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2 border border-gray-300 text-stone-700 rounded-lg focus:outline-none focus:border-blue-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6 flex justify-end items-center">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mr-2"
            />
            <label className="text-gray-600 text-base">
              Submit as Anonymous
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 text-white rounded-lg ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Grievance"}
          </button>
        </form>
      </div>
    </LoadingOverlay>
  );
}
