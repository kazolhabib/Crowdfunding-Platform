"use client";

import React, { useState, useEffect } from "react";
import { Card, Spinner } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { HeartHandshake, Clock, Coins } from "lucide-react";

export default function SupporterPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalCount: 0, pendingCount: 0, approvedTotal: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/supporter/contributions?limit=1");
        const data = await res.json();
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Fetch stats error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Spinner size="lg" color="warning" label="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-[#645d52] text-xs font-bold uppercase tracking-[0.14em] mt-1">
          Track your contributions and discover campaigns to support.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-6 flex items-center gap-5">
            <div className="p-3.5 bg-[#ebe3d5] text-[#9a3412] border border-[#bfb5a3] rounded-none">
              <HeartHandshake size={28} />
            </div>
            <div>
              <span className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
                {stats.totalCount}
              </span>
              <p className="text-[#645d52] text-[10px] font-bold uppercase tracking-[0.12em] mt-1">
                Total Contributions
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-6 flex items-center gap-5">
            <div className="p-3.5 bg-[#ebe3d5] text-[#b45309] border border-[#bfb5a3] rounded-none">
              <Clock size={28} />
            </div>
            <div>
              <span className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
                {stats.pendingCount}
              </span>
              <p className="text-[#645d52] text-[10px] font-bold uppercase tracking-[0.12em] mt-1">
                Pending Contributions
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-6 flex items-center gap-5">
            <div className="p-3.5 bg-[#ebe3d5] text-[#15803d] border border-[#bfb5a3] rounded-none">
              <Coins size={28} />
            </div>
            <div>
              <span className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
                {stats.approvedTotal}
              </span>
              <p className="text-[#645d52] text-[10px] font-bold uppercase tracking-[0.12em] mt-1">
                Credits Contributed (Approved)
              </p>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
