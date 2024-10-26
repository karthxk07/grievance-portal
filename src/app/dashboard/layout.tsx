// app/dashboard/layout.tsx

import Sidebar from "@/components/dashboard/Sidebar"; // Adjust the import path as necessary
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto bg-gray-100">{children}</main>
    </div>
  );
}
