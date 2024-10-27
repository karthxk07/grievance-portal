// app/dashboard/layout.tsx // Adjust the import path as necessary
import Sidebar from "@/components/admin/SideBar";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto bg-gray-100 relative">
        {children}
      </main>
    </div>
  );
}