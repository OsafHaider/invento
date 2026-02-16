"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import AlertsDropdown from "./alert-dropdown";
import AISummaryCard from "./ai-summary";
import { authAPI } from "@/lib/auth-api";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, isAuthenticated, setUser, setIsAuthenticated } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const res = await authAPI.logout();
      console.log(res);
      if (res.success) {
        setUser(null);
        setIsAuthenticated(false);
        router.push("/sign-in");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-primary flex items-center gap-2"
        >
          <Image src="/logo.svg" alt="Invento Logo" width={32} height={32} />
          Invento
        </Link>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <Link href="/products" className="text-sm hover:text-primary">
                Products
              </Link>
              <Link href="/profile" className="text-sm hover:text-primary">
                Profile
              </Link>
            </div>
            <AISummaryCard />
            <AlertsDropdown />
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium">{user.name}</p>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link href="/sign-in">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
