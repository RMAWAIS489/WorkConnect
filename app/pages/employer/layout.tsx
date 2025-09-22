"use client";
import EmployerSidebar from "@/app/components/employer/sidebar";
import { useState } from "react";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  return (
    
    <div className="flex h-screen bg-gray-100">
          <EmployerSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className={`flex-1 p-6  overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
            {children} 
          </div>
        </div>
    
  );
}

