"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "./api";

export function useAuthGuard(role = "user", redirectTo) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken(role);
    if (!token) {
      router.replace(redirectTo || (role === "admin" ? "/admin/login" : "/user/login"));
    }
  }, [router, role, redirectTo]);
}
