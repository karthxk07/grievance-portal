import Link from "next/link";
import { FileText, Power, Send, User } from "lucide-react";
import SignOutButton from "../auth/SignOutButton";
import logo from "../../../public/logo.png";
import Image from "next/image";

export default function Sidebar() {
  return (
    <div className="h-screen w-64 flex flex-col z-10  shadow-stone-400 shadow-[1px_1px_32px_2px] bg-gray-200 text-darkBlue  justify-between  overflow-hidden">
      <div className="flex flex-col">
        <Image
          src={logo.src}
          alt="logo"
          width={120}
          height={120}
          className="mx-auto"
        />
        <h1 className="text-xl font-bold my-5 mb-10 mx-auto">
          <span className="text-primaryMaroon">AIMK </span>Grievance Portal
        </h1>
        <nav className="space-y-4 m-3">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 p-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
          >
            <FileText size={20} />
            <span>Current Grievances</span>
          </Link>
          <Link
            href="/dashboard/submit"
            className="flex items-center space-x-2 p-2 bg-gray-300 hover:bg-gray-400  rounded-lg"
          >
            <Send size={20} />
            <span>Submit a Grievance</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex items-center space-x-2 p-2 bg-gray-300 hover:bg-gray-400  rounded-lg"
          >
            <User size={20} />
            <span>Profile</span>
          </Link>
        </nav>
      </div>
      <div className="bg-gray-300 py-4 px-2 gap-x-3 flex flex-row justify-center items-center">
        <Power />
        <SignOutButton />
      </div>
    </div>
  );
}
