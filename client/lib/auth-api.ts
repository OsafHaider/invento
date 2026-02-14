import { apiFetch } from "./fetch-api-wrapper";


const BACKEND_URL= "http://localhost:8080"
export const authAPI = {
  // 🔐 LOGIN
  signIn: async (data: { email: string; password: string }) => {
    const res = await fetch(`${BACKEND_URL}/api/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const result = await res.json();

    // access token save
    localStorage.setItem("accessToken", result.accessToken);

    return result;
  },

  // 📝 REGISTER
  signUp: async (data: { name: string; email: string; password: string }) => {
    const res = await fetch(`${BACKEND_URL}/api/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Signup failed");
    }

    return res.json();
  },

  // 👤 PROFILE (Protected)
  profile: async () => {
    const res = await apiFetch(`${BACKEND_URL}/api/auth/profile`, {
      method: "GET",
    });

    if (!res?.ok) {
      throw new Error("Failed to fetch profile");
    }

    return res.json();
  },

  // 🚪 LOGOUT
  logout: async () => {
    await apiFetch(`${BACKEND_URL}/logout`, {
      method: "POST",
    });

    localStorage.removeItem("accessToken");
  },
};
