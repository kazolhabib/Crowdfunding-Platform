"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import { Card, Button, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Calendar, Target, TrendingUp } from "lucide-react";

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
        <Spinner size="lg" color="primary" label="Loading campaigns..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
          Explore Campaigns
        </h1>
        <p className="text-zinc-500 text-xs mt-1">
          Discover active campaigns and support innovative projects.
        </p>
      </div>

      {campaigns.length === 0 ? (
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <Card.Content className="p-8 text-center text-sm text-zinc-500">
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
                className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden"
              >
                {camp.image_url && (
                  <div className="h-40 w-full bg-zinc-200 dark:bg-zinc-800">
                    <img
                      src={camp.image_url}
                      alt={camp.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Card.Content className="p-5 flex flex-col gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-1">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">by {camp.creator_name}</p>
                  </div>

                  <div className="flex flex-col gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-zinc-400" />
                      <span>Deadline: {new Date(camp.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target size={14} className="text-zinc-400" />
                      <span>Goal: {camp.funding_goal} Credits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-zinc-400" />
                      <span>Raised: {camp.amount_raised} Credits ({percent}%)</span>
                    </div>
                  </div>

                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <Button
                    color="primary"
                    size="sm"
                    className="font-semibold w-full"
                    onPress={() => router.push(`/campaigns/${camp._id}`)}
                  >
                    View Details
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
