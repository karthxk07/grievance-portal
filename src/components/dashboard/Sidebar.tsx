import Link from "next/link";
import { FileText, Send } from "lucide-react";
import SignOutButton from "../auth/SignOutButton";

export default function Sidebar() {
  return (
    <div className="h-screen w-64    text-white p-4  ">
      <h1 className="text-xl font-bold mb-8">Grievance Portal</h1>
      <nav className="space-y-4">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg"
        >
          <FileText size={20} />
          <span>Current Grievances</span>
        </Link>
        <Link
          href="/dashboard/submit"
          className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-lg"
        >
          <Send size={20} />
          <span>Submit a Grievance</span>
        </Link>
      </nav>

      <SignOutButton />
    </div>
  );
}
