// app/profile/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth/useAuth";
import { useFirestore } from "@/hooks/firestore/useFirestore";
import { UserProfile } from "@/types/userProfile";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const userFirestore = useFirestore("users");

  useEffect(() => {
    if (user && !loading) {
      // Fetch user profile from Firestore

      userFirestore
        .getById(user.uid)
        .then((data) => setProfile(data as unknown as UserProfile))
        .catch(() => setError("Failed to load profile"));
    }
  }, [user, userFirestore, loading]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return profile ? (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-black mb-4">Profile</h1>
      <div className="bg-white text-stone-800 shadow rounded-lg p-6 grid grid-cols-2 ">
        <div className="mb-4">
          <h2 className="text-lg font-bold ">Name:</h2>
          <p className="text-stone-600">{profile.name}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-bold">Email:</h2>
          <p className="text-stone-600">{profile.email}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-bold">Registration Number:</h2>
          <p className="text-stone-600">{profile.regno}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-bold">User Role:</h2>
          <p className="text-stone-600">{profile.isAdmin ? "Admin" : "User"}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-bold">Created At:</h2>
          <p className="text-stone-600">
            {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <p>No profile data available.</p>
  );
}
