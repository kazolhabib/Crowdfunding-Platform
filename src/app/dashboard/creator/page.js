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
          Here is an overview of your campaign activity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Campaigns */}
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-6 flex items-center gap-5">
            <div className="p-3.5 bg-[#ebe3d5] text-[#9a3412] border border-[#bfb5a3] rounded-none">
              <FolderGit size={28} />
            </div>
            <div>
              <span className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
                {totalCampaigns}
              </span>
              <p className="text-[#645d52] text-[10px] font-bold uppercase tracking-[0.12em] mt-1">
                Campaigns Launched
              </p>
            </div>
          </Card.Content>
        </Card>

        {/* Active Campaigns */}
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-6 flex items-center gap-5">
            <div className="p-3.5 bg-[#ebe3d5] text-[#15803d] border border-[#bfb5a3] rounded-none">
              <Flame size={28} />
            </div>
            <div>
              <span className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
                {activeCampaigns}
              </span>
              <p className="text-[#645d52] text-[10px] font-bold uppercase tracking-[0.12em] mt-1">
                Active Campaigns
              </p>
            </div>
          </Card.Content>
        </Card>

        {/* Total Amount Raised */}
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-6 flex items-center gap-5">
            <div className="p-3.5 bg-[#ebe3d5] text-[#b45309] border border-[#bfb5a3] rounded-none">
              <Coins size={28} />
            </div>
            <div>
              <span className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
                {totalRaised}
              </span>
              <p className="text-[#645d52] text-[10px] font-bold uppercase tracking-[0.12em] mt-1">
                Total Credits Raised
              </p>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
