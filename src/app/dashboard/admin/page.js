"use client";

import React, { useEffect, useState } from "react";
import { Card, Spinner } from "@heroui/react";
import { CreditCard, HandCoins, UsersRound, UserRoundCog } from "lucide-react";

const CARDS = [
  { key: "supporters", label: "Total Supporters", icon: UsersRound, color: "text-[#9a3412] bg-[#ebe3d5] border border-[#bfb5a3]" },
  { key: "creators", label: "Total Creators", icon: UserRoundCog, color: "text-[#6366f1] bg-[#ebe3d5] border border-[#bfb5a3]" },
  { key: "availableCredits", label: "Available Credits", icon: HandCoins, color: "text-[#b45309] bg-[#ebe3d5] border border-[#bfb5a3]" },
  { key: "processedPayments", label: "Processed Payments", icon: CreditCard, color: "text-[#15803d] bg-[#ebe3d5] border border-[#bfb5a3]" },
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

  if (!stats && !error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" color="warning" label="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h1 className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">Admin Home</h1>
        <p className="mt-1 text-xs text-[#645d52] font-bold uppercase tracking-[0.14em]">
          Platform activity and payment overview.
        </p>
      </div>

      {error ? (
        <Card className="border border-red-200 bg-red-50/50 rounded-none shadow-sm">
          <Card.Content className="p-4 text-sm text-red-600 font-semibold">
            {error}
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {CARDS.map(({ key, label, icon: Icon, color }) => (
            <Card key={key} className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
              <Card.Content className="flex items-center gap-4 p-5">
                <span className={`rounded-none p-3.5 ${color}`}><Icon size={23} /></span>
                <div>
                  <p className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">{stats[key]}</p>
                  <p className="text-[#645d52] text-[10px] font-bold uppercase tracking-[0.12em] mt-1">{label}</p>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
