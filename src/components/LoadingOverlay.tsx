import React from "react";

export default function LoadingOverlay({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: React.ReactNode;
}) {
  if (!isLoading) return children;

  return (
    <div className="relative">
      {children}

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
        {/* Loading spinner container */}
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center gap-3">
          {/* Spinner animation */}
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}
