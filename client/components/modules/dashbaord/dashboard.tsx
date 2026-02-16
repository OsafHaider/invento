"use client";
import { useAuth } from "@/context/auth-context";
import React from "react";

const Dashboard = () => {
  const { user } = useAuth();
  if (user?.role !== "admin") {
    return <div className="text-center mt-20 text-xl">Access Denied</div>;
  }
  return <div>Dashboard</div>;
};

export default Dashboard;
