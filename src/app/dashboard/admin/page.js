"use client";

import React, { useEffect, useState } from "react";
import { Card, Spinner } from "@heroui/react";
import { CreditCard, HandCoins, UsersRound, UserRoundCog } from "lucide-react";

const CARDS = [
  { key: "supporters", label: "Total Supporters", icon: UsersRound, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
  { key: "creators", label: "Total Creators", icon: UserRoundCog, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/30" },
  { key: "availableCredits", label: "Available Credits", icon: HandCoins, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30" },
  { key: "processedPayments", label: "Processed Payments", icon: CreditCard, color: "text-green-600 bg-green-50 dark:bg-green-950/30" },
];

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load statistics.");
        setStats(data.stats);
      } catch (loadError) {
        setError(loadError.message);
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  if (!stats && !error) return <div className="flex min-h-[40vh] items-center justify-center"><Spinner size="lg" label="Loading admin dashboard..." /></div>;

  return (
    <div className="flex flex-col gap-7">
      <div><h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">Admin Home</h1><p className="mt-1 text-xs text-zinc-500">Platform activity and payment overview.</p></div>
      {error ? <Card className="border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20"><Card.Content className="p-4 text-sm text-red-600">{error}</Card.Content></Card> : <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{CARDS.map(({ key, label, icon: Icon, color }) => <Card key={key} className="border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><Card.Content className="flex items-center gap-4 p-5"><span className={`rounded-xl p-3 ${color}`}><Icon size={23} /></span><div><p className="text-2xl font-extrabold text-zinc-900 dark:text-white">{stats[key]}</p><p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{label}</p></div></Card.Content></Card>)}</div>}
    </div>
  );
}
