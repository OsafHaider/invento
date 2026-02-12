"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userName, setUserName] = React.useState("");

  React.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name);
      } catch (e) {
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/sign-in";
  };

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Invento
        </Link>

        {isLoggedIn ? (
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <Link href="/products" className="text-sm hover:text-primary">
                Products
              </Link>
              <Link href="/profile" className="text-sm hover:text-primary">
                Profile
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <p className="font-medium">{userName}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
              >
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
