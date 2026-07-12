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
        <Spinner size="lg" color="primary" label="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-zinc-500 text-xs mt-1">
          Track your contributions and discover campaigns to support.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <Card.Content className="p-6 flex items-center gap-5">
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
              <HeartHandshake size={28} />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                {stats.totalCount}
              </span>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-0.5">
                Total Contributions
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <Card.Content className="p-6 flex items-center gap-5">
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
              <Clock size={28} />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                {stats.pendingCount}
              </span>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-0.5">
                Pending Contributions
              </p>
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <Card.Content className="p-6 flex items-center gap-5">
            <div className="p-3.5 rounded-xl bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30">
              <Coins size={28} />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                {stats.approvedTotal}
              </span>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-0.5">
                Credits Contributed (Approved)
              </p>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
