"use client";

import React, { useState, useEffect } from "react";
import { Card, Spinner } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import { FolderGit, Flame, Coins } from "lucide-react";

export default function CreatorHomePage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/creator/campaigns");
        const data = await res.json();
        if (data.success) setCampaigns(data.campaigns);
      } catch (err) {
        console.error("Fetch campaigns error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => new Date(c.deadline) > new Date()).length;
  const totalRaised = campaigns.reduce((sum, c) => sum + c.amount_raised, 0);

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
        <p className="text-zinc-500 text-xs mt-1">Here is an overview of your campaign activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Campaigns */}
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <Card.Content className="p-6 flex items-center gap-5">
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
              <FolderGit size={28} />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                {totalCampaigns}
              </span>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-0.5">
                Campaigns Launched
              </p>
            </div>
          </Card.Content>
        </Card>

        {/* Active Campaigns */}
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <Card.Content className="p-6 flex items-center gap-5">
            <div className="p-3.5 rounded-xl bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30">
              <Flame size={28} />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                {activeCampaigns}
              </span>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-0.5">
                Active Campaigns
              </p>
            </div>
          </Card.Content>
        </Card>

        {/* Total Amount Raised */}
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <Card.Content className="p-6 flex items-center gap-5">
            <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
              <Coins size={28} />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                {totalRaised}
              </span>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-0.5">
                Total Credits Raised
              </p>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
