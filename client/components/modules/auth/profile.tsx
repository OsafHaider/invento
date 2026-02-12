"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { authAPI, type User } from "@/lib/auth-api";

const Profile = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        setUser(response.user);
      } catch (err) {
        setError("Failed to load profile");
        console.error("Profile fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    authAPI.logout();
  };

  if (isLoading) {
    return (
      <section className="w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <p className="text-destructive">{error}</p>
            <Button onClick={handleLogout} variant="outline">
              Back to Sign In
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">No user data found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-2xl mx-auto p-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your account information
          </p>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <p className="text-lg text-foreground mt-1">{user.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <p className="text-lg text-foreground mt-1">{user.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Role
            </label>
            <p className="text-lg text-foreground mt-1 capitalize">
              {user.role}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              User ID
            </label>
            <p className="text-sm text-muted-foreground mt-1 font-mono">
              {user.id}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Created
            </label>
            <p className="text-sm text-muted-foreground mt-1">
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
            onClick={() => (window.location.href = "/")}
          >
            Go to Home
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
