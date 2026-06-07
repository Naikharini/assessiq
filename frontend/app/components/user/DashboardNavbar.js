"use client";

import Image from "next/image";
 import { useRouter } from "next/navigation";
export default function DashboardNavbar() {
    const router = useRouter();

  const handleLogout = () => {
    
    router.push("/user/login");
  };
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto text-black flex justify-between items-center px-4 py-3">
        <Image
          src="/Logo.png"
          alt="AssessIQ"
          width={150}
          height={45}
        />
 
        <div className="text-right">
          <p className="font-semibold">User</p>
          <p className="text-sm text-gray-500">
            user@example.com
          </p>
        </div>
        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </header>
  );
}