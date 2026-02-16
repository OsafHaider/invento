"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { authAPI } from "@/lib/auth-api";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  // useEffect(() => {
  //   const initAuth = async () => {
  //     try {
  //       const data = await authAPI.profile();
  //       console.log(data);
  //     } catch (err) {
  //       localStorage.removeItem("accessToken");
  //     }
  //   };

  //   initAuth();
  // }, []);
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            {isAuthenticated
              ? `Welcome back, ${user?.name || "User"}!👋`
              : "Welcome to Invento!"}
          </h1>
          <h1 className="text-5xl md:text-6xl font-bold">Invento</h1>
          <p className="text-xl text-muted-foreground">
            Simple and powerful inventory management system
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Link className={isAuthenticated ? "hidden" : ""} href="/sign-in">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 space-y-4 hover:bg-muted/50 transition-colors">
            <div className="text-3xl">📦</div>
            <h3 className="text-xl font-semibold">Manage Products</h3>
            <p className="text-sm text-muted-foreground">
              Create, view, edit, and delete your products easily
            </p>
            <Link href="/products">
              <Button variant="outline" className="w-full">
                View Products
              </Button>
            </Link>
          </div>

          <div className="border rounded-lg p-6 space-y-4 hover:bg-muted/50 transition-colors">
            <div className="text-3xl">👥</div>
            <h3 className="text-xl font-semibold">Profile</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your account information
            </p>
            <Link href="/profile">
              <Button variant="outline" className="w-full">
                My Profile
              </Button>
            </Link>
          </div>

          <div className="border rounded-lg p-6 space-y-4 hover:bg-muted/50 transition-colors">
            <div className="text-3xl">➕</div>
            <h3 className="text-xl font-semibold">Add Product</h3>
            <p className="text-sm text-muted-foreground">
              Quickly add a new product to your inventory
            </p>
            <Link href="/products/create">
              <Button className="w-full">Create Product</Button>
            </Link>
          </div>
        </div>

        {/* Extra Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Features</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ Manage your product inventory</li>
              <li>✓ Track product details and pricing</li>
              <li>✓ Secure authentication</li>
              <li>✓ User-friendly dashboard</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Getting Started</h3>
            <ol className="space-y-2 text-muted-foreground">
              <li>1. Create an account</li>
              <li>2. Sign in to your dashboard</li>
              <li>3. Add your products</li>
              <li>4. Start managing your inventory</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
