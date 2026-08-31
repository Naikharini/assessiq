const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function getToken(role = "user") {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(role === "admin" ? "adminToken" : "token");
}

export function setToken(token, role = "user") {
  if (role === "admin") {
    localStorage.setItem("adminToken", token);
  } else {
    localStorage.setItem("token", token);
  }
}

export async function apiFetch(path, options = {}, role = "user") {
  const token = getToken(role);
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export { API_URL };
