"use client";

import React from "react";
import { Card, Button, Avatar } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut, Coins, Shield } from "lucide-react";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) return null; // Middleware handles redirection

  return (
    <div className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            Welcome back, {user.name}!
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Here is your account overview and credentials.
          </p>
        </div>
        <Button
          color="danger"
          variant="flat"
          onClick={handleLogout}
          startContent={<LogOut size={16} />}
          className="font-semibold"
        >
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md">
          <Card.Content className="p-8 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-zinc-800 dark:text-white pb-4 border-b border-zinc-150 dark:border-zinc-800">
              Profile Details
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar
                className="w-24 h-24 ring-4 ring-blue-100 dark:ring-blue-900/50 rounded-full"
                name={user.name}
              >
                <Avatar.Image src={user.photoURL} alt={user.name} />
                <Avatar.Fallback>{user.name[0]}</Avatar.Fallback>
              </Avatar>
              <div className="flex flex-col gap-2 text-center sm:text-left">
                <h3 className="text-2xl font-bold text-zinc-850 dark:text-white">{user.name}</h3>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30 text-xs font-semibold w-fit mx-auto sm:mx-0">
                  <Shield size={14} />
                  {user.role}
                </span>
                <p className="text-zinc-500 text-sm mt-1">{user.email}</p>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md">
          <Card.Content className="p-8 flex flex-col items-center justify-center text-center h-full gap-4">
            <div className="p-4 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
              <Coins size={36} className="text-amber-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                Available Balance
              </h2>
              <span className="text-4xl font-extrabold text-zinc-800 dark:text-white block mt-1">
                {user.credits} Credits
              </span>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-[200px]">
              {user.role === "Supporter"
                ? "Use your credits to back innovative crowdfunding campaigns."
                : "Raise funds from supporters and request withdrawals."}
            </p>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
