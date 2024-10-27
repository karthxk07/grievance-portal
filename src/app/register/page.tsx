"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import LoadingOverlay from "@/components/LoadingOverlay";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Image from "next/image";
import logo from "../../../public/logo.png";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [regno, setRegno] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!/^\d{2}\/\d{4}\/[A-Z]$/.test(regno)) {
      setError(
        "Invalid registration number format. Please use format: XX/XXXX/X"
      );
      setLoading(false);
      return;
    }

    // Validate email
    if (!/^[a-zA-Z0-9._%+-]+@aim\.ac\.in$/.test(email)) {
      setError("Invalid email format. Email must end with @aim.ac.in");
      setLoading(false);
      return;
    }

    try {
      const userCredentials = await signUp(email, password);

      // Create user profile in Firestore
      await setDoc(doc(db, "users", userCredentials.uid), {
        name,
        regno,
        createdAt: new Date().toISOString(),
        email,
        isAdmin: false, // Set default role; adjust as needed
      });

      router.push("/dashboard");

      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <LoadingOverlay isLoading={loading}>
      <div className="absolute top-0 left-0 m-5">
        <Image src={logo.src} alt="Logo" width={40} height={50} />
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <h2 className="text-3xl font-bold text-center text-black">
            Create Account
          </h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-base font-medium text-stone-500"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm outline-none py-2 px-2"
              />
            </div>
            <div>
              <label
                htmlFor="regno"
                className="block text-base font-medium text-stone-500"
              >
                Regn No.
              </label>
              <input
                id="regno"
                type="text"
                required
                value={regno}
                onChange={(e) => setRegno(e.target.value)}
                className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm outline-none py-2 px-2"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-base font-medium text-stone-500"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm outline-none py-2 px-2"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-base font-medium text-stone-500"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm outline-none py-2 px-2"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-base font-medium text-stone-500"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm outline-none py-2 px-2"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Account
            </button>
          </form>
          <div className="text-center">
            <Link href="/login" className="text-blue-600 hover:text-blue-500">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}
