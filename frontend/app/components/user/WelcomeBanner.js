"use client";

import { useRouter } from "next/navigation";

export default function WelcomeBanner() {
  const router = useRouter();

  return (
    <div className="glass-banner rounded-2xl p-8">
      <h2 className="text-2xl text-slate-900 font-bold">
        Ready to Test Your Skills?
      </h2>
      <p className="text-slate-600 mt-3 max-w-lg">
        Choose from various topics and difficulty levels to challenge yourself
        and track your progress.
      </p>
      <button
        onClick={() => router.push("/user/assessment")}
        className="glass-btn mt-6 px-6 py-3 rounded-xl text-sm font-medium"
      >
        Start New Assessment
      </button>
    </div>
  );
}
