"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { setAccessToken, clearAccessToken } from "@/lib/token";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

// 1. Define the User structure based on your data
interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin"; // Use a union if there are specific roles
  createdAt: string;
  updatedAt: string;
}

// 2. Define the Context shape
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

// 3. Initialize with the type (defaults to undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router=useRouter()
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const data = await apiFetch("/api/auth/refresh", { method: "POST" });
        setAccessToken(data.data.accessToken);

        const profile = await apiFetch("/api/auth/profile");
        setUser(profile.data.user);
      } catch (error) {
        clearAccessToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const logout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }
    clearAccessToken();
    router.push("/sign-in");
    setUser(null);
   
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated: !!user && !loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
