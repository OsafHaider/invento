"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import Loading from "@/components/loading";

const Profile = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading, logout } = useAuth();
  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated || !user) {
    return (
      <section className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Unauthorized</p>
      </section>
    );
  }

  return (
    <section className="w-full max-w-2xl mx-auto p-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your account information
          </p>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <p className="text-lg mt-1">{user.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <p className="text-lg mt-1">{user.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Role
            </label>
            <p className="text-lg mt-1 capitalize">{user.role}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              User ID
            </label>
            <p className="text-sm mt-1 font-mono">{user.id}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Created
            </label>
            <p className="text-sm mt-1">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/")}
          >
            Go to Home
          </Button>

          <Button variant="destructive" className="flex-1" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
