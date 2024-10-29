"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/useAuth";
import LoadingOverlay from "@/components/LoadingOverlay";
import Image from "next/image";
import logo from "../../../public/logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await auth.signIn(email, password);

      auth.checkAdmin(user.uid).then((isAdmin) => {
        return isAdmin ? router.push("/admin") : router.push("/dashboard");
      });

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
          <h2 className="text-3xl text-black font-bold text-center">Sign in</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className=" ">
              <label
                htmlFor="email"
                className="block text-base font-medium text-stone-500 "
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
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign in
            </button>
          </form>
          <div className="text-center">
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-500"
            >
              Don&#39;t have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}
