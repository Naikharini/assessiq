 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
export default function WelcomeBanner() {
     const router = useRouter();
  return (
    <div className="bg-blue-50 rounded-2xl p-8">
      <h2 className="text-2xl text-black font-bold">
        Ready to Test Your Skills?
      </h2>
 
      <p className="text-gray-700 mt-3">
        Choose from various topics and difficulty
        levels to challenge yourself and track
        your progress.
      </p>
 
       <button
            onClick={() => router.push("/user/assessment")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl">
        Start New Assessment
      </button>
    </div>
  );
}