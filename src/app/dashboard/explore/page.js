"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import { Card, Button, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Calendar, Target, TrendingUp, ArrowRight } from "lucide-react";

export default function ExplorePage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns/explore");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Spinner size="lg" color="warning" label="Loading campaigns..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-3xl tracking-[-0.04em] text-[#24231f]">
          Explore Campaigns
        </h1>
        <p className="text-[#645d52] text-xs font-bold uppercase tracking-[0.14em] mt-1">
          Discover active campaigns and support innovative projects.
        </p>
      </div>

      {campaigns.length === 0 ? (
        <Card className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none">
          <Card.Content className="p-8 text-center text-xs font-bold uppercase tracking-wider text-[#776f63]">
            No active campaigns available right now. Check back soon!
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((camp) => {
            const percent = Math.min(
              100,
              Math.round((camp.amount_raised / camp.funding_goal) * 100)
            );
            return (
              <Card
                key={camp._id}
                className="border border-[#bfb5a3] bg-[#fdfaf4] shadow-[4px_4px_0_#24231f] rounded-none overflow-hidden hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#24231f] transition-all duration-200"
              >
                {camp.image_url && (
                  <div className="h-44 w-full bg-[#ebe3d5] border-b border-[#bfb5a3]">
                    <img
                      src={camp.image_url}
                      alt={camp.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Card.Content className="p-5 flex flex-col gap-4">
                  <div>
                    <h3 className="font-serif text-lg tracking-[-0.02em] text-[#24231f] line-clamp-1">
                      {camp.title}
                    </h3>
                    <p className="text-[#645d52] text-[10px] font-bold uppercase tracking-wider mt-1">
                      by {camp.creator_name}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 text-xs font-semibold text-[#645d52]">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#bfb5a3]" />
                      <span>Deadline: {new Date(camp.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target size={14} className="text-[#bfb5a3]" />
                      <span>Goal: {camp.funding_goal} Credits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-[#bfb5a3]" />
                      <span>Raised: {camp.amount_raised} Credits ({percent}%)</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-[#ebe3d5] rounded-none overflow-hidden border border-[#bfb5a3]/50">
                    <div
                      className="h-full bg-[#9a3412] transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <Button
                    onClick={() => router.push(`/campaigns/${camp._id}`)}
                    className="w-full h-11 bg-[#ebe3d5] text-[#24231f] font-bold border border-[#bfb5a3] rounded-none uppercase tracking-wider text-xs hover:bg-[#24231f] hover:text-[#f4f0e8] hover:border-[#24231f] transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0_#24231f] mt-1"
                  >
                    View Details
                    <ArrowRight size={14} />
                  </Button>
                </Card.Content>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
