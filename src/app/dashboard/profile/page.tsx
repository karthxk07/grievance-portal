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
      console.log(user.uid);
      userFirestore
        .getById(user.uid)
        .then((data) => setProfile(data as unknown as UserProfile))
        .then((data) => {
          console.log(data);
        })
        .catch((err) => setError("Failed to load profile"));
    }
  }, [user, loading]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return profile ? (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold">Name:</h2>
          <p>{profile.name}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-bold">Email:</h2>
          <p>{profile.email}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-bold">Registration Number:</h2>
          <p>{profile.regno}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-bold">Admin Status:</h2>
          <p>{profile.isAdmin ? "Admin" : "User"}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-bold">Created At:</h2>
          <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  ) : (
    <p>No profile data available.</p>
  );
}
